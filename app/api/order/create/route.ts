// app/api/order/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderData, paymentData } = body;

    console.log("📝 Création commande:", { orderData, paymentData });

    // Générer un code de retrait unique
    const pickupCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Date de livraison estimée (5 jours)
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 5);

    // Créer la commande dans Sanity
    const order = {
      _type: "order",
      orderNumber: orderData.orderNumber,
      trackingNumber: trackingNumber,
      pickupCode: pickupCode,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      address: orderData.address,
      items: orderData.items.map((item: any) => ({
        productId: item.id || item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      total: orderData.total,
      paymentMethod: paymentData.paymentMethod,
      paymentStatus: "paid",
      transactionId: paymentData.transactionId,
      deliveryStatus: "pending",
      createdAt: new Date().toISOString(),
      expectedDeliveryDate: expectedDeliveryDate.toISOString(),
    };

    console.log("📤 Sauvegarde dans Sanity:", order);

    const savedOrder = await client.create(order);
    
    console.log("✅ Commande sauvegardée:", savedOrder);

    return NextResponse.json({
      success: true,
      order: savedOrder,
      pickupCode: pickupCode,
      trackingNumber: trackingNumber,
    });
    
  } catch (error) {
    console.error("❌ Erreur création commande:", error);
    return NextResponse.json(
      { error: "Failed to create order", details: error },
      { status: 500 }
    );
  }
}