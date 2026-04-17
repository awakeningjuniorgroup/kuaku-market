// app/api/invoice/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
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

    // Récupérer les données de la commande
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

    // Pour la production, vous pouvez utiliser puppeteer pour générer un PDF
    // Sinon, retourner le HTML pour l'impression
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html);
    
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "20mm",
        right: "20mm",
      },
    });
    
    await browser.close();

    // Retourner le PDF
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="facture-${orderNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}