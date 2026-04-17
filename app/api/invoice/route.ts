// app/api/invoice/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { generateInvoiceHTML, InvoiceData } from "@/utils/invoiceGenerator";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number is required" },
        { status: 400 }
      );
    }

    // Récupérer les données de la commande depuis Sanity
    const order = await client.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]{
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        address,
        items[]{
          productId,
          name,
          quantity,
          price
        },
        subtotal,
        discount,
        total,
        paymentMethod,
        paymentStatus,
        transactionId,
        createdAt
      }`,
      { orderNumber }
    );

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Préparer les données pour la facture
    const invoiceData: InvoiceData = {
      invoiceNumber: `INV-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      date: new Date(order.createdAt).toLocaleDateString('fr-FR'),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        address: order.address,
      },
      items: order.items.map((item: any) => ({
        id: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity,
      })),
      subtotal: order.subtotal,
      discount: order.discount || 0,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      transactionId: order.transactionId,
    };

    // Générer le HTML
    const html = generateInvoiceHTML(invoiceData);

    // Retourner le HTML
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Invoice generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, invoiceData } = body;

    // Sauvegarder la facture dans Sanity
    const invoice = {
      _type: "invoice",
      invoiceNumber: `INV-${orderNumber}`,
      orderNumber: orderNumber,
      customerName: invoiceData.customer.name,
      customerEmail: invoiceData.customer.email,
      total: invoiceData.total,
      paymentMethod: invoiceData.paymentMethod,
      transactionId: invoiceData.transactionId,
      createdAt: new Date().toISOString(),
      pdfUrl: `/api/invoice/download?orderNumber=${orderNumber}`,
    };

    await client.create(invoice);

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    console.error("Error saving invoice:", error);
    return NextResponse.json(
      { error: "Failed to save invoice" },
      { status: 500 }
    );
  }
}