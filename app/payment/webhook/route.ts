// app/api/payment/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, orderNumber, status, phoneNumber, amount } = body;

    if (status === "SUCCESS") {
      // Mettre à jour la session de paiement
      await client
        .patch(orderNumber)
        .set({
          status: "paid",
          paidAt: new Date().toISOString(),
          transactionId: transactionId,
        })
        .commit();

      // Mettre à jour la commande
      await client
        .patch(orderNumber)
        .set({
          paymentStatus: "paid",
          paymentDate: new Date().toISOString(),
          status: "paid",
        })
        .commit();

      // Créer la commande avec QR code
      const orderData = await client.fetch(
        `*[_type == "paymentSession" && orderNumber == $orderNumber][0]{
          customerName,
          customerEmail,
          customerPhone,
          items,
          address,
          amount
        }`,
        { orderNumber }
      );

      // Appeler l'API pour créer la commande avec QR code
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/order/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderData: {
            orderNumber: orderNumber,
            customerName: orderData.customerName,
            customerEmail: orderData.customerEmail,
            customerPhone: orderData.customerPhone,
            address: orderData.address,
            items: orderData.items,
            total: orderData.amount,
          },
          paymentData: {
            paymentMethod: body.method || "mtn",
            transactionId: transactionId,
            paymentPhone: phoneNumber,
          }
        })
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}