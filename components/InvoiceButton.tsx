// components/InvoiceButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface InvoiceButtonProps {
  orderNumber: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export const InvoiceButton = ({ 
  orderNumber, 
  variant = "default", 
  size = "default" 
}: InvoiceButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownloadInvoice = async () => {
    setLoading(true);
    try {
      // Option 1: Télécharger le PDF directement
      const response = await fetch(`/api/invoice/download?orderNumber=${orderNumber}`);
      
      if (!response.ok) {
        throw new Error("Failed to generate invoice");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `facture-${orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Facture téléchargée avec succès !");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Erreur lors du téléchargement de la facture");
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = () => {
    window.open(`/api/invoice?orderNumber=${orderNumber}`, "_blank");
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={variant}
        size={size}
        onClick={handleDownloadInvoice}
        disabled={loading}
      >
        <Download className="w-4 h-4 mr-2" />
        {loading ? "Génération..." : "Télécharger PDF"}
      </Button>
      <Button
        variant="outline"
        size={size}
        onClick={handleViewInvoice}
      >
        <FileText className="w-4 h-4 mr-2" />
        Aperçu
      </Button>
    </div>
  );
};