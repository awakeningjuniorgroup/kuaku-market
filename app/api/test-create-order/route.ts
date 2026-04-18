// app/api/test-create-order/route.ts
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const testOrder = {
      _type: "order",
      orderNumber: `TEST-${Date.now()}`,
      customerName: "Test Client",
      customerEmail: "test@example.com",
      customerPhone: "699999999",
      items: [],
      subtotal: 1000,
      total: 1000,
      paymentMethod: "mtn",
      paymentStatus: "paid",
      transactionId: "TEST-TX",
      deliveryStatus: "pending",
      createdAt: new Date().toISOString(),
    };

    const result = await client.create(testOrder);
    return NextResponse.json({ success: true, order: result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}