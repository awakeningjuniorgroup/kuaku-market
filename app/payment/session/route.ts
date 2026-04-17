// app/api/payment/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const paymentSession = {
      _type: "paymentSession",
      orderNumber: body.orderNumber,
      amount: body.amount,
      customerPhone: body.customerPhone,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      items: body.items,
      address: body.address,
      ussdCode: body.ussdCode,
      qrCode: body.qrCode,
      paymentMethod: body.paymentMethod,
      status: body.status,
      createdAt: body.createdAt,
      expiresAt: body.expiresAt,
    };

    const result = await client.create(paymentSession);
    
    return NextResponse.json({ success: true, session: result });
  } catch (error) {
    console.error("Error creating payment session:", error);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number required" },
        { status: 400 }
      );
    }

    const session = await client.fetch(
      `*[_type == "paymentSession" && orderNumber == $orderNumber][0]`,
      { orderNumber }
    );

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error fetching payment session:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment session" },
      { status: 500 }
    );
  }
}