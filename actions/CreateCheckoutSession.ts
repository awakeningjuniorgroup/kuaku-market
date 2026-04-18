// actions/CreateCheckoutSession.ts
import { CartItem } from "@/store";
import { Address } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  address?: Address | null;
  paymentMethod: "mtn" | "orange";
  paymentPhone: string;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export interface CheckoutSessionResponse {
  paymentUrl: string;
  ussdCode: string;
  qrCode: string;
  transactionId: string;
}

// Mode simulation
const FORCE_SIMULATION_MODE = true;

// Fonction principale exportée
export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata
): Promise<CheckoutSessionResponse> {
  console.log("🚀 createCheckoutSession called", { 
    paymentMethod: metadata.paymentMethod,
    itemCount: items.length 
  });
  
  if (FORCE_SIMULATION_MODE) {
    return simulatePayment(items, metadata);
  }

  // Code réel pour Kuaku Market
  try {
    const config = {
      apiUrl: process.env.KUAKU_API_URL || "https://api.kuakumarket.com/v1",
      primaryKey: process.env.KUAKU_PRIMARY_KEY,
      secondaryKey: process.env.KUAKU_SECONDARY_KEY,
    };

    const { paymentMethod, paymentPhone } = metadata;
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.product.price!,
      0
    );

    const transactionId = `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const cleanPhone = paymentPhone.replace(/^\+237|^237|^0/g, '');

    await saveOrderToSanity(items, metadata, totalAmount, transactionId, cleanPhone);

    const response = await fetch(`${config.apiUrl}/payment/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Primary-Key": config.primaryKey || "",
        "X-Secondary-Key": config.secondaryKey || "",
      },
      body: JSON.stringify({
        transaction_id: transactionId,
        amount: Math.round(totalAmount),
        currency: "XAF",
        phone_number: cleanPhone,
        payment_method: paymentMethod === "mtn" ? "mtn_money" : "orange_money",
        customer_name: metadata.customerName,
        customer_email: metadata.customerEmail,
        description: `Commande ${metadata.orderNumber}`,
        order_number: metadata.orderNumber,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    return {
      paymentUrl: typeof data.payment_url === 'string' ? data.payment_url : `/payment/${paymentMethod}?order=${metadata.orderNumber}`,
      ussdCode: typeof data.ussd_code === 'string' ? data.ussd_code : "",
      qrCode: typeof data.qr_code === 'string' ? data.qr_code : "",
      transactionId: transactionId,
    };
  } catch (error) {
    console.error("❌ Erreur, passage en simulation:", error);
    return simulatePayment(items, metadata);
  }
}

// Simulation de paiement
async function simulatePayment(
  items: GroupedCartItems[],
  metadata: Metadata
): Promise<CheckoutSessionResponse> {
  console.log("🎮 Mode simulation");
  
  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.product.price!,
    0
  );
  
  const transactionId = `SIM-${Date.now()}`;
  const cleanPhone = metadata.paymentPhone.replace(/^\+237|^237|^0/g, '');
  const orderNumber = metadata.orderNumber;
  
  // Sauvegarder la commande (non bloquante)
  saveOrderToSanity(items, metadata, totalAmount, transactionId, cleanPhone).catch(err => {
    console.error("❌ Erreur sauvegarde (non bloquante):", err);
  });
  
  // Générer un code USSD
  const merchantCode = Math.floor(Math.random() * 1000000);
  const ussdCode = metadata.paymentMethod === "mtn"
    ? `*126*${merchantCode}*${totalAmount}*${orderNumber.substring(0, 8)}#`
    : `#144*${merchantCode}*${totalAmount}*${orderNumber.substring(0, 8)}#`;
  
  const paymentUrl = `/payment/simulate?order=${orderNumber}&amount=${totalAmount}&method=${metadata.paymentMethod}`;
  
  return {
    paymentUrl: paymentUrl,
    ussdCode: ussdCode,
    qrCode: "",
    transactionId: transactionId,
  };
}

// Fonction de sauvegarde
async function saveOrderToSanity(
  items: GroupedCartItems[],
  metadata: Metadata,
  totalAmount: number,
  transactionId: string,
  cleanPhone: string
) {
  try {
    console.log("📝 Sauvegarde de la commande dans Sanity...");
    
    const pickupCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 5);
    
    const orderData = {
      orderNumber: metadata.orderNumber,
      customerName: metadata.customerName,
      customerEmail: metadata.customerEmail,
      customerPhone: cleanPhone,
      address: metadata.address,
      items: items.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      subtotal: totalAmount,
      discount: 0,
      total: totalAmount,
      paymentMethod: metadata.paymentMethod,
      paymentStatus: "paid",
      transactionId: transactionId,
      deliveryStatus: "pending",
      trackingNumber: trackingNumber,
      pickupCode: pickupCode,
      expectedDeliveryDate: expectedDeliveryDate.toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    console.log("📤 Envoi à l'API create order...");
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/order/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderData })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log("✅ Commande sauvegardée:", result.order?.orderNumber);
      return result.order;
    } else {
      console.error("❌ Erreur sauvegarde:", result);
      return null;
    }
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde:", error);
    return null;
  }
}