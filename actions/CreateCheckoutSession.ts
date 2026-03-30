"use server";

import { CartItem } from "@/store";
import stripe from "@/lib/stripe";
import { Address } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Stripe from "stripe"

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  address?: Address | null;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  try {
    // récupérer le client existant ou en créer un nouveau
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });
    const customerId = customers?.data?.length > 0 ? customers.data[0].id : "";

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        address: JSON.stringify(metadata.address),
      },
      mode: "payment",
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      invoice_creation: {
        enabled: true,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      line_items: items?.map((item) => ({
        price_data: {
          currency: "XAF",
          unit_amount: Math.round(item.product.price!),
          product_data: {
            name: item?.product?.name || "product name",
            description: item?.product?.description,
            metadata: { id: item?.product?._id },
            images:
              item?.product?.images && item?.product?.images?.length > 0
                ? [urlFor(item?.product?.images[0]).url()]
                : undefined,
          },
        },
        quantity: item?.quantity,
      })),
    };
    if (customerId) {
      sessionPayload.customer = customerId;
    } else {
      sessionPayload.customer_email = metadata.customerEmail;
    }

    // Créez la session de paiement Stripe
    const session = await stripe.checkout.sessions.create(sessionPayload);
     return session.url;
  } catch (error) {
    console.error("Error creating Checkout session", error);
    throw error;
  }
}
