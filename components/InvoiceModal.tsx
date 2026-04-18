// components/InvoiceModal.tsx
"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Printer, Copy, Check, X } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import PriceFormatter from "@/components/PriceFormatter";
import toast from "react-hot-toast";

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  trackingNumber: string;
  pickupCode: string;
  date: string;
  dueDate: string;
  expectedDeliveryDate: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      city?: string;
      state?: string;
      address?: string;
    } | null;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  deliveryStatus: string;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  invoiceData,
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  if (!invoiceData) {
    return null;
  }

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printContent = invoiceRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Facture ${invoiceData.invoiceNumber}</title>
              <meta charset="UTF-8">
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-white p-8">
              ${printContent}
              <script>
                window.onload = () => { window.print(); window.close(); };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const copyPickupCode = () => {
    navigator.clipboard.writeText(invoiceData.pickupCode);
    setCopied(true);
    toast.success("Code de retrait copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/track-order/${invoiceData.orderNumber}?code=${invoiceData.pickupCode}`;
  const pickupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pickup/${invoiceData.orderNumber}?code=${invoiceData.pickupCode}`;

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "⏳ En attente",
      paid: "✅ Payé",
      processing: "🔧 En traitement",
      shipped: "📦 Expédié",
      out_for_delivery: "🚚 En livraison",
      delivered: "🏠 Livré",
      ready_for_pickup: "📍 Prêt pour retrait",
      picked_up: "✓ Retiré",
      cancelled: "❌ Annulé",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      out_for_delivery: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      ready_for_pickup: "bg-green-100 text-green-800",
      picked_up: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Facture {invoiceData.invoiceNumber}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Facture */}
        <div ref={invoiceRef} className="bg-white p-6 rounded-lg">
          {/* En-tête */}
          <div className="text-center border-b pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">KUAKU MARKET</h1>
            <p className="text-gray-500">123 Avenue Principale, Douala, Cameroun</p>
            <p className="text-gray-500">
              Tél: +237 6XX XXX XXX | Email: contact@kuakumarket.com
            </p>
          </div>

          {/* Titre */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green-600">FACTURE AVEC SUIVI</h2>
            <p className="text-gray-500">Document officiel de transaction</p>
          </div>

          {/* QR Codes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border rounded-lg p-4 text-center bg-gray-50">
              <h3 className="font-semibold text-gray-700 mb-2">📱 Suivi</h3>
              <div className="flex justify-center">
                <QRCodeCanvas value={trackingUrl} size={100} level="H" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Scannez pour suivre</p>
            </div>
            <div className="border rounded-lg p-4 text-center bg-gray-50">
              <h3 className="font-semibold text-gray-700 mb-2">🏪 Retrait</h3>
              <div className="flex justify-center">
                <QRCodeCanvas value={pickupUrl} size={100} level="H" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Présentez au retrait</p>
            </div>
            <div className="border rounded-lg p-4 text-center bg-gray-50">
              <h3 className="font-semibold text-gray-700 mb-2">📦 Commande</h3>
              <div className="flex justify-center">
                <QRCodeCanvas
                  value={JSON.stringify({
                    order: invoiceData.orderNumber,
                    code: invoiceData.pickupCode,
                  })}
                  size={100}
                  level="H"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Identification</p>
            </div>
          </div>

          {/* Suivi */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-800 mb-2">🚚 Suivi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p><span className="font-medium">Statut:</span> <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(invoiceData.deliveryStatus)}`}>{getStatusText(invoiceData.deliveryStatus)}</span></p>
              <p><span className="font-medium">N° Suivi:</span> {invoiceData.trackingNumber}</p>
              <p><span className="font-medium">Livraison:</span> {invoiceData.expectedDeliveryDate}</p>
              <p className="flex items-center gap-2"><span className="font-medium">Code retrait:</span> <code className="bg-white px-2 py-1 rounded font-mono text-sm">{invoiceData.pickupCode}</code>
                <button onClick={copyPickupCode} className="text-blue-500">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
              </p>
            </div>
          </div>

          {/* Infos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Facture</h3>
              <p className="text-sm">N°: <strong>{invoiceData.invoiceNumber}</strong></p>
              <p className="text-sm">Commande: <strong>{invoiceData.orderNumber}</strong></p>
              <p className="text-sm">Date: <strong>{invoiceData.date}</strong></p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Client</h3>
              <p className="text-sm">{invoiceData.customer.name}</p>
              <p className="text-sm">{invoiceData.customer.email}</p>
              <p className="text-sm">{invoiceData.customer.phone}</p>
            </div>
          </div>

          {/* Tableau */}
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Produit</th>
                <th className="border p-2 text-center">Qté</th>
                <th className="border p-2 text-right">Prix</th>
                <th className="border p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2 text-right"><PriceFormatter amount={item.unitPrice} /></td>
                  <td className="border p-2 text-right"><PriceFormatter amount={item.total} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-end mb-6">
            <div className="w-64">
              <div className="flex justify-between py-2 border-b"><span>Sous-total</span><PriceFormatter amount={invoiceData.subtotal} /></div>
              <div className="flex justify-between py-2 border-b"><span>Remise</span><PriceFormatter amount={invoiceData.discount} /></div>
              <div className="flex justify-between py-2 font-bold text-lg"><span>TOTAL</span><PriceFormatter amount={invoiceData.total} className="text-green-600" /></div>
            </div>
          </div>

          {/* Paiement */}
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <h4 className="font-semibold text-green-800 mb-2">💰 Paiement</h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <p><span className="font-medium">Mode:</span> {invoiceData.paymentMethod === "mtn" ? "MTN Money" : "Orange Money"}</p>
              <p><span className="font-medium">Statut:</span> {invoiceData.paymentStatus === "paid" ? "✅ Payé" : "⏳ En attente"}</p>
              <p><span className="font-medium">Transaction:</span> {invoiceData.transactionId}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-400 pt-4 border-t mt-6">
            <p>Merci de votre confiance !</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};