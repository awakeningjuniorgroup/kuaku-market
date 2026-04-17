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

// Mode simulation - mettre à false pour utiliser l'API réelle
const FORCE_SIMULATION_MODE = false;

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

    if (!config.primaryKey || !config.secondaryKey) {
      console.warn("⚠️ Clés API manquantes, passage en simulation");
      return simulatePayment(items, metadata);
    }

    const { paymentMethod, paymentPhone } = metadata;
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.product.price!,
      0
    );

    const transactionId = `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const cleanPhone = paymentPhone.replace(/^\+237|^237|^0/g, '');

    const response = await fetch(`${config.apiUrl}/payment/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Primary-Key": config.primaryKey,
        "X-Secondary-Key": config.secondaryKey,
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
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payment/callback`,
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/success?orderNumber=${metadata.orderNumber}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/cart`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Kuaku API error:", response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Kuaku API response:", data);
    
    return {
      paymentUrl: typeof data.payment_url === 'string' && data.payment_url 
        ? data.payment_url 
        : `/payment/${paymentMethod}?order=${metadata.orderNumber}&transaction=${transactionId}`,
      ussdCode: typeof data.ussd_code === 'string' ? data.ussd_code : "",
      qrCode: typeof data.qr_code === 'string' ? data.qr_code : "",
      transactionId: typeof data.transaction_id === 'string' ? data.transaction_id : transactionId,
    };
  } catch (error) {
    console.error("❌ Erreur API Kuaku:", error);
    return simulatePayment(items, metadata);
  }
}

// Simulation de paiement pour le développement
async function simulatePayment(
  items: GroupedCartItems[],
  metadata: Metadata
): Promise<CheckoutSessionResponse> {
  console.log("🎮 Mode simulation activé");
  
  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.product.price!,
    0
  );
  
  const transactionId = `SIM-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const cleanPhone = metadata.paymentPhone.replace(/^\+237|^237|^0/g, '');
  const orderNumber = metadata.orderNumber;
  
  // Générer un code USSD réaliste
  const merchantCode = Math.floor(Math.random() * 1000000);
  const ussdCode = metadata.paymentMethod === "mtn"
    ? `*126*${merchantCode}*${totalAmount}*${orderNumber.substring(0, 8)}#`
    : `#144*${merchantCode}*${totalAmount}*${orderNumber.substring(0, 8)}#`;
  
  // Générer un QR code factice
  const qrData = {
    merchant: metadata.paymentMethod === "mtn" ? "MTN Cameroon" : "Orange Cameroon",
    amount: totalAmount,
    currency: "XAF",
    orderNumber: orderNumber,
    phoneNumber: cleanPhone,
    timestamp: new Date().toISOString(),
  };
  
  const qrCodeBase64 = Buffer.from(JSON.stringify(qrData)).toString('base64');
  
  // URL de redirection
  const paymentUrl = `/payment/simulate?order=${orderNumber}&amount=${totalAmount}&method=${metadata.paymentMethod}`;
  
  console.log("✅ Simulation générée:", { 
    ussdCode, 
    paymentUrl, 
    transactionId,
    amount: totalAmount 
  });
  
  // Stocker dans localStorage pour suivi
  if (typeof window !== 'undefined') {
    try {
      const pendingTransactions = JSON.parse(localStorage.getItem('pending_transactions') || '[]');
      pendingTransactions.push({
        transactionId,
        orderNumber,
        amount: totalAmount,
        phone: cleanPhone,
        method: metadata.paymentMethod,
        ussdCode,
        status: 'pending',
        timestamp: Date.now(),
      });
      localStorage.setItem('pending_transactions', JSON.stringify(pendingTransactions));
    } catch (e) {
      console.warn("Impossible de sauvegarder dans localStorage");
    }
  }
  
  return {
    paymentUrl: paymentUrl,
    ussdCode: ussdCode,
    qrCode: qrCodeBase64,
    transactionId: transactionId,
  };
}