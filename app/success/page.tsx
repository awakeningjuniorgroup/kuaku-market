// app/success/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Download, Printer, QrCode } from "lucide-react";
import Container from "@/components/Container";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { generateInvoiceWithQRHTML, InvoiceData } from "@/utils/invoiceWithQRGenerator";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const isSimulation = searchParams.get("sim") === "true";
  const [loading, setLoading] = useState(true);
  const [invoiceHtml, setInvoiceHtml] = useState<string>("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      fetchAndGenerateInvoice();
    }
  }, [orderNumber]);

  const fetchAndGenerateInvoice = async () => {
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
        const invoiceData: InvoiceData = {
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
          items: order.items.map((item: any) => ({
            id: item.productId,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            total: item.price * item.quantity,
          })),
          subtotal: order.subtotal || order.total,
          discount: order.discount || 0,
          total: order.total,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          transactionId: order.transactionId,
          deliveryStatus: order.deliveryStatus || "pending",
        };

        const html = await generateInvoiceWithQRHTML(invoiceData);
        setInvoiceHtml(html);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Erreur lors de la génération de la facture");
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir la facture dans un nouvel onglet
  const viewInvoice = () => {
    if (invoiceHtml) {
      const win = window.open();
      win?.document.write(invoiceHtml);
      win?.document.close();
    }
  };

  // Télécharger la facture en HTML
  const downloadInvoiceHTML = () => {
    if (invoiceHtml) {
      const blob = new Blob([invoiceHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `facture-${orderNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Facture HTML téléchargée !");
    }
  };

  // Imprimer / Sauvegarder en PDF
  const printInvoice = () => {
    if (invoiceHtml) {
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(invoiceHtml);
      printWindow?.document.close();
      printWindow?.onload = () => {
        printWindow?.print();
        toast.success("Utilisez 'Enregistrer au format PDF' dans la boîte de dialogue d'impression");
      };
    }
  };

  // Télécharger en PDF (via l'impression)
  const downloadInvoicePDF = () => {
    setDownloading(true);
    if (invoiceHtml) {
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(invoiceHtml);
      printWindow?.document.close();
      
    } else {
      setDownloading(false);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

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
      <div className="max-w-2xl mx-auto py-12">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Commande confirmée ! 🎉
          </h1>
          
          <p className="text-gray-600 mb-2">
            Votre commande a été enregistrée avec succès.
          </p>
          
          {orderNumber && (
            <p className="text-sm text-gray-500 mb-6">
              Numéro de commande : <span className="font-mono">{orderNumber}</span>
            </p>
          )}
          
          {isSimulation && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                ⚠️ Mode simulation - Aucun paiement réel n'a été effectué.
              </p>
            </div>
          )}
          
          {/* Boutons facture */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <Button 
              onClick={viewInvoice}
              variant="outline"
              className="flex flex-col items-center gap-1 py-3 h-auto"
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs">Aperçu</span>
            </Button>
            
            <Button 
              onClick={downloadInvoiceHTML}
              variant="outline"
              className="flex flex-col items-center gap-1 py-3 h-auto"
            >
              <Download className="w-5 h-5" />
              <span className="text-xs">HTML</span>
            </Button>
            
            <Button 
              onClick={printInvoice}
              variant="outline"
              className="flex flex-col items-center gap-1 py-3 h-auto"
            >
              <Printer className="w-5 h-5" />
              <span className="text-xs">Imprimer</span>
            </Button>
            
            <Button 
              onClick={downloadInvoicePDF}
              disabled={downloading}
              className="flex flex-col items-center gap-1 py-3 h-auto bg-blue-600 hover:bg-blue-700"
            >
              <QrCode className="w-5 h-5" />
              <span className="text-xs">{downloading ? "Chargement..." : "PDF"}</span>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/track-order/${orderNumber}`}>
              <Button variant="outline">
                📦 Suivre ma commande
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost">
                🏠 Continuer mes achats
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}