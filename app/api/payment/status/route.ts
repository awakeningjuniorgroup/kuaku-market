// app/api/payment/status/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get("orderNumber");
    const paymentMethod = searchParams.get("method");

    if (!orderNumber || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    let status = "pending";
    
    // Vérifier le statut du paiement selon le mode
    if (paymentMethod === "mtn") {
      status = await checkMTNPaymentStatus(orderNumber);
    } else if (paymentMethod === "orange") {
      status = await checkOrangePaymentStatus(orderNumber);
    }

    return NextResponse.json({ status });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

async function checkMTNPaymentStatus(orderNumber: string): Promise<string> {
  // Implémenter la vérification du statut MTN
  // Retourner "success", "pending", ou "failed"
  return "pending";
}

async function checkOrangePaymentStatus(orderNumber: string): Promise<string> {
  // Implémenter la vérification du statut Orange
  // Retourner "success", "pending", ou "failed"
  return "pending";
}