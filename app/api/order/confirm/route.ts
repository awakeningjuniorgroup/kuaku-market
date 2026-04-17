// app/api/order/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get("orderNumber");
    const paymentMethod = searchParams.get("paymentMethod");
    const status = searchParams.get("status");

    if (status === "success") {
      // Mettre à jour le statut de la commande
      await client
        .patch(orderNumber!)
        .set({
          paymentStatus: "paid",
          deliveryStatus: "pending",
          updatedAt: new Date().toISOString(),
        })
        .commit();

      // Récupérer la commande pour obtenir le code de retrait
      const order = await client.fetch(
        `*[_type == "order" && orderNumber == $orderNumber][0]{
          pickupCode
        }`,
        { orderNumber }
      );

      // Rediriger vers la page de succès
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/success?orderNumber=${orderNumber}&code=${order?.pickupCode || ""}`
      );
    } else {
      // Rediriger vers le panier en cas d'échec
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/cart?error=payment_failed`);
    }
  } catch (error) {
    console.error("Order confirmation error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/cart?error=confirmation_failed`);
  }
}