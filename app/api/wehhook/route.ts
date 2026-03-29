import { Metadata } from "@/actions/CreateCheckoutSession";
import stripe from "@/lib/stripe";
import { backendClient } from "@/lib/backendClient";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Helper pour générer un UUID stable, compatible Node/browser.
 */
function generateKey(): string {
  try {
    return (globalThis as any).crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

interface Address {
  state?: string | null;
  zip?: string | null;
  city?: string | null;
  address?: string | null;
  name?: string | null;
}

interface ExtendedMetadata extends Metadata {
  orderNumber?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  clerkUserId?: string | null;
  address?: string;
}

interface SanityOrderProduct {
  _key: string;
  product: {
    _type: "reference";
    _ref: string;
  };
  quantity: number;
}

interface SanityOrder {
  _type: "order";
  orderNumber?: string | null;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  customerName?: string | null;
  stripeCustomerId: string | null;
  clerkUserId?: string | null;
  email: string | null;
  currency: string | null;
  amountDiscount: number;
  products: SanityOrderProduct[];
  totalPrice: number;
  status: string;
  orderDate: string;
  invoice: {
    id: string;
    number: string | null;
    hosted_invoice_url: string | null;
  } | null;
  address: Address | null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No Signature found for stripe" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Stripe webhook secret is not set");
    return NextResponse.json({ error: "Stripe webhook secret is not set" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: `Webhook Error: ${error}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const invoice = session.invoice ? await stripe.invoices.retrieve(session.invoice as string) : null;
      await createOrderInSanity(session, invoice);
    } catch (error) {
      console.error(`Error creating order in sanity (session=${session?.id ?? "unknown"}):`, error);
      return NextResponse.json({ error: `Error creating order: ${error}` }, { status: 400 });
    }
  }

  return NextResponse.json({ received: true });
}

async function createOrderInSanity(session: Stripe.Checkout.Session, invoice: Stripe.Invoice | null) {
  const { id, amount_total, currency, metadata, payment_intent, total_details } = session;

  // Sécuriser metadata
  const metadataObj = (metadata ?? {}) as ExtendedMetadata;

  const {
    orderNumber = null,
    customerName = null,
    customerEmail = null,
    clerkUserId = null,
    address: addressString = undefined,
  } = metadataObj;

  let parsedAddress: Address | null = null;
  try {
    parsedAddress = addressString ? JSON.parse(addressString) : null;
  } catch (err) {
    console.warn("Failed to parse address JSON from metadata:", err);
    parsedAddress = null;
  }

  // Récupérer les line items avec le produit étendu
  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(id, { expand: ["data.price.product"] });

  // Préparer produits Sanity et mises à jour de stock
  const sanityProducts: SanityOrderProduct[] = [];
  const stockUpdates: { productId: string; quantity: number }[] = [];

  for (const item of lineItemsWithProduct.data) {
    const product = item.price?.product as Stripe.Product | undefined;
    const productId = product?.metadata?.id;
    const quantity = item?.quantity ?? 0;

    if (!productId) {
      console.warn("Line item missing product metadata.id, session:", id, "lineItem:", item);
      continue;
    }

    sanityProducts.push({
      _key: generateKey(),
      product: {
        _type: "reference",
        _ref: productId,
      },
      quantity,
    });

    stockUpdates.push({ productId, quantity });
  }

  // Construire le document order (sans créer encore)
  const orderDoc: SanityOrder = {
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent ?? null,
    customerName,
    stripeCustomerId: (session.customer as string) ?? null,
    clerkUserId,
    email: session.customer_details?.email ?? customerEmail ?? null,
    currency: currency ?? null,
    amountDiscount: total_details?.amount_discount ? total_details.amount_discount / 100 : 0,
    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
    invoice: invoice
      ? {
          id: invoice.id,
          number: invoice.number ?? null,
          hosted_invoice_url: invoice.hosted_invoice_url ?? null,
        }
      : null,
    address: parsedAddress,
  };

  // Utiliser une transaction pour créer la commande et décrémenter le stock atomiquement
  try {
    const tx = backendClient.transaction();
    tx.create(orderDoc);

    for (const { productId, quantity } of stockUpdates) {
      tx.patch(productId).inc({ stock: -quantity });
    }

    const result = await tx.commit();
    return result;
  } catch (txError) {
    console.error("Sanity transaction failed, attempting fallback. Error:", txError);

    // Fallback : créer la commande puis tenter de mettre à jour les stocks individuellement
    try {
      const createdOrder = await backendClient.create(orderDoc);
      for (const { productId, quantity } of stockUpdates) {
        try {
          const product = await backendClient.getDocument(productId);
          if (!product || typeof product.stock !== "number") {
            console.warn(`Product with ID ${productId} not found or stock is invalid.`);
            continue;
          }
          const newStock = Math.max(product.stock - quantity, 0);
          await backendClient.patch(productId).set({ stock: newStock }).commit();
        } catch (err) {
          console.error(`Failed to update stock for product ${productId} in fallback:`, err);
        }
      }
      return createdOrder;
    } catch (createErr) {
      console.error("Fallback creation of order also failed:", createErr);
      throw createErr;
    }
  }
}
