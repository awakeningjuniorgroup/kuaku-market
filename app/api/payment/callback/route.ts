// app/api/payment/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, status, orderNumber, paymentMethod } = body;

    console.log("Payment callback received:", { transactionId, status, orderNumber, paymentMethod });

    // Mettre à jour le statut de la commande dans Sanity
    if (status === "SUCCESS" || status === "SUCCESSFUL") {
      await client
        .patch(orderNumber)
        .set({
          paymentStatus: "paid",
          paymentMethod: paymentMethod,
          transactionId: transactionId,
          paidAt: new Date().toISOString(),
        })
        .commit();
    } else if (status === "FAILED" || status === "CANCELLED") {
      await client
        .patch(orderNumber)
        .set({
          paymentStatus: "failed",
          paymentMethod: paymentMethod,
          transactionId: transactionId,
          failedAt: new Date().toISOString(),
        })
        .commit();
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}