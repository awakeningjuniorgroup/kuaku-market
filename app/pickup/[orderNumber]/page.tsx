// app/pickup/[orderNumber]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import { client } from "@/sanity/lib/client";
import { MapPin, Clock, User, Package, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const PickupPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = params.orderNumber as string;
  const verificationCode = searchParams.get("code");
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber && verificationCode) {
      fetchOrder();
    }
  }, [orderNumber, verificationCode]);

  const fetchOrder = async () => {
    try {
      const orderData = await client.fetch(
        `*[_type == "order" && orderNumber == $orderNumber && pickupCode == $pickupCode][0]{
          orderNumber,
          customerName,
          customerPhone,
          items,
          pickupQRCode,
          pickupCode
        }`,
        { orderNumber, pickupCode: verificationCode }
      );
      setOrder(orderData);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Code invalide
            </h2>
            <p className="text-gray-600">
              Veuillez vérifier votre code de retrait
            </p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-lg border shadow-lg overflow-hidden">
          <div className="bg-green-600 text-white p-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Retrait de commande</h1>
            <p className="opacity-90">Présentez ce document au point de retrait</p>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-gray-100 rounded-lg">
                <QrCode className="w-16 h-16 text-gray-600" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-600">Numéro de commande</span>
                <span className="font-semibold">{order.orderNumber}</span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-600">Code de retrait</span>
                <span className="font-mono font-bold text-lg text-green-600">
                  {order.pickupCode}
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-600">Client</span>
                <span className="font-semibold">{order.customerName}</span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-600">Téléphone</span>
                <span>{order.customerPhone}</span>
              </div>

              <div className="border-b pb-3">
                <span className="text-gray-600 block mb-2">Articles</span>
                <div className="space-y-1">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "XAF",
                        }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Point de retrait
              </h3>
              <p className="text-sm text-gray-700">
                Avenue Principale, Douala, Cameroun<br />
                Tél: +237 6XX XXX XXX<br />
                Horaires: Lundi - Samedi, 8h - 18h
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link href={`/track-order/${order.orderNumber}?code=${verificationCode}`}>
                <Button variant="outline">
                  Suivre ma commande
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PickupPage;