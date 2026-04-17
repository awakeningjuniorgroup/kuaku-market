// app/track-order/[orderNumber]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import { client } from "@/sanity/lib/client";
import { CheckCircle, Truck, Package, MapPin, Clock, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceButton } from "@/components/InvoiceButton";
import Link from "next/link";
import Image from "next/image";

interface OrderStatus {
  status: string;
  date: string;
  description: string;
}

interface Order {
  orderNumber: string;
  trackingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: any;
  items: any[];
  total: number;
  deliveryStatus: string;
  pickupCode: string;
  qrCode: string;
  pickupQRCode: string;
  createdAt: string;
  expectedDeliveryDate: string;
  statusHistory: OrderStatus[];
}

const TrackOrderPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = params.orderNumber as string;
  const verificationCode = searchParams.get("code");
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          trackingNumber,
          customerName,
          customerEmail,
          customerPhone,
          address,
          items[]{
            name,
            quantity,
            price,
            image
          },
          total,
          deliveryStatus,
          pickupCode,
          qrCode,
          pickupQRCode,
          createdAt,
          expectedDeliveryDate,
          statusHistory
        }`,
        { orderNumber, pickupCode: verificationCode }
      );

      if (!orderData) {
        setError("Commande non trouvée ou code invalide");
      } else {
        setOrder(orderData);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Erreur lors du chargement de la commande");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case "paid":
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      case "processing":
        return <Package className="w-6 h-6 text-purple-500" />;
      case "shipped":
        return <Truck className="w-6 h-6 text-orange-500" />;
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "En attente",
      paid: "Payée",
      processing: "En traitement",
      shipped: "Expédiée",
      delivered: "Livrée",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
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

  if (error || !order) {
    return (
      <Container>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Erreur
            </h2>
            <p className="text-gray-600">{error || "Commande non trouvée"}</p>
            <Link href="/">
              <Button className="mt-4">Retour à l'accueil</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">Suivi de commande</h1>
          <p className="opacity-90">
            Numéro de commande : {order.orderNumber}
          </p>
          <p className="opacity-90">
            Numéro de suivi : {order.trackingNumber}
          </p>
        </div>

        {/* QR Code Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6 text-center">
            <h3 className="font-semibold text-lg mb-3">QR Code de suivi</h3>
            <div className="flex justify-center mb-3">
              <Image
                src={order.qrCode}
                alt="QR Code de suivi"
                width={200}
                height={200}
                className="border rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-600">
              Scannez ce code pour suivre votre commande
            </p>
          </div>

          <div className="bg-white rounded-lg border p-6 text-center">
            <h3 className="font-semibold text-lg mb-3">QR Code de retrait</h3>
            <div className="flex justify-center mb-3">
              <Image
                src={order.pickupQRCode}
                alt="QR Code de retrait"
                width={200}
                height={200}
                className="border rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-600">
              Présentez ce code au point de retrait
            </p>
            <div className="mt-3 p-2 bg-gray-100 rounded">
              <p className="text-sm font-mono">Code: {order.pickupCode}</p>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <h2 className="font-semibold text-xl mb-6">Statut de la commande</h2>
          <div className="relative">
            {order.statusHistory.map((status, index) => (
              <div key={index} className="flex mb-8 last:mb-0">
                <div className="flex-shrink-0 mr-4">
                  {getStatusIcon(status.status)}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {getStatusText(status.status)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {status.description}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(status.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  {index < order.statusHistory.length - 1 && (
                    <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Informations de livraison
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">{order.customerName}</p>
              <p className="text-gray-700 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {order.customerPhone}
              </p>
              <p className="text-gray-700 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {order.customerEmail}
              </p>
              {order.address && (
                <p className="text-gray-700">
                  {order.address.address}, {order.address.city}, {order.address.state}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-lg mb-4">Détails de la commande</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "XAF",
                    }).format(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between pt-2">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "XAF",
                  }).format(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <InvoiceButton orderNumber={order.orderNumber} />
          <Link href={`/pickup/${order.orderNumber}?code=${order.pickupCode}`}>
            <Button variant="outline">
              Instructions de retrait
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost">
              Continuer mes achats
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default TrackOrderPage;