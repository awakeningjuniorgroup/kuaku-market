// app/success/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, RefreshCw } from "lucide-react";
import Container from "@/components/Container";
import { InvoiceModal, InvoiceData } from "@/components/InvoiceModal";
import { client } from "@/sanity/lib/client";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const isSimulation = searchParams.get("sim") === "true";
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const fetchOrderData = async () => {
    setLoading(true);
    try {
      const order = await client.fetch(
        `*[_type == "order" && orderNumber == $orderNumber][0]{
          orderNumber,
          trackingNumber,
          pickupCode,
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
          deliveryStatus,
          createdAt,
          expectedDeliveryDate
        }`,
        { orderNumber }
      );

      if (order) {
        setInvoiceData({
          invoiceNumber: `INV-${order.orderNumber.substring(0, 8)}`,
          orderNumber: order.orderNumber,
          trackingNumber: order.trackingNumber || `TRK-${Date.now()}`,
          pickupCode: order.pickupCode || Math.random().toString(36).substring(2, 10).toUpperCase(),
          date: new Date(order.createdAt).toLocaleDateString("fr-FR"),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR"),
          expectedDeliveryDate: order.expectedDeliveryDate
            ? new Date(order.expectedDeliveryDate).toLocaleDateString("fr-FR")
            : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR"),
          customer: {
            name: order.customerName,
            email: order.customerEmail,
            phone: order.customerPhone,
            address: order.address,
          },
          items: order.items?.map((item: any) => ({
            id: item.productId,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            total: item.price * item.quantity,
          })) || [],
          subtotal: order.subtotal || order.total,
          discount: order.discount || 0,
          total: order.total,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          transactionId: order.transactionId,
          deliveryStatus: order.deliveryStatus || "pending",
        });
      } else {
        toast.error("Commande non trouvée. Cliquez sur Rafraîchir.");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      fetchOrderData();
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Commande confirmée ! 🎉
        </h1>

        <p className="text-gray-600 mb-2">
          Votre commande a été enregistrée avec succès.
        </p>

        {orderNumber && (
          <p className="text-sm text-gray-500 mb-6">
            N° commande : <span className="font-mono">{orderNumber}</span>
          </p>
        )}

        {isSimulation && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">⚠️ Mode simulation - Aucun paiement réel n'a été effectué.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={() => setShowInvoice(true)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!invoiceData}
          >
            <FileText className="w-4 h-4 mr-2" />
            Voir / Imprimer ma facture
          </Button>

          {!invoiceData && (
            <Button 
              variant="outline" 
              onClick={fetchOrderData}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Rafraîchir
            </Button>
          )}
        </div>

        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          🏠 Continuer mes achats
        </Button>
      </div>

      <InvoiceModal
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
        invoiceData={invoiceData}
      />
    </Container>
  );
}