// app/api/order/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { generateOrderQRCode, generatePickupQRCode } from "@/utils/qrGenerator";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderData, paymentData } = body;

    // Générer un code de récupération unique
    const pickupCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    const trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Calculer la date de livraison estimée (3-5 jours)
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 5);

    // Préparer les données du QR code
    const qrData = {
      orderNumber: orderData.orderNumber,
      trackingNumber: trackingNumber,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      pickupCode: pickupCode,
      deliveryStatus: "pending",
      createdAt: new Date().toISOString(),
      expectedDeliveryDate: expectedDeliveryDate.toISOString(),
    };

    // Générer les QR codes
    const qrCode = await generateOrderQRCode(qrData);
    const pickupQRCode = await generatePickupQRCode(orderData.orderNumber, pickupCode);

    // Sauvegarder la commande dans Sanity avec les QR codes
    const order = {
      _type: "order",
      orderNumber: orderData.orderNumber,
      trackingNumber: trackingNumber,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      address: orderData.address,
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      total: orderData.total,
      paymentMethod: paymentData.paymentMethod,
      paymentStatus: "paid",
      transactionId: paymentData.transactionId,
      deliveryStatus: "pending",
      pickupCode: pickupCode,
      qrCode: qrCode,
      pickupQRCode: pickupQRCode,
      createdAt: new Date().toISOString(),
      expectedDeliveryDate: expectedDeliveryDate.toISOString(),
      statusHistory: [
        {
          status: "pending",
          date: new Date().toISOString(),
          description: "Commande créée",
        },
        {
          status: "paid",
          date: new Date().toISOString(),
          description: "Paiement confirmé",
        },
      ],
    };

    const savedOrder = await client.create(order);

    return NextResponse.json({
      success: true,
      order: savedOrder,
      pickupCode: pickupCode,
      trackingNumber: trackingNumber,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}