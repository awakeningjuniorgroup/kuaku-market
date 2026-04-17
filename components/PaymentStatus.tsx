// components/PaymentStatus.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface PaymentStatusProps {
  orderNumber: string;
  paymentMethod: string;
}

export const PaymentStatus = ({ orderNumber, paymentMethod }: PaymentStatusProps) => {
  const [status, setStatus] = useState<"pending" | "success" | "failed">("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(
          `/api/payment/status?orderNumber=${orderNumber}&method=${paymentMethod}`
        );
        const data = await response.json();
        setStatus(data.status);
      } catch (error) {
        console.error("Error checking status:", error);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(checkStatus, 3000);
    checkStatus();

    return () => clearInterval(interval);
  }, [orderNumber, paymentMethod]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600">Vérification du paiement...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold text-green-600">Paiement réussi !</h2>
        <p className="mt-2 text-gray-600">Votre commande a été confirmée.</p>
        <Button className="mt-6" onClick={() => (window.location.href = "/orders")}>
          Voir mes commandes
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <XCircle className="w-16 h-16 text-red-500" />
      <h2 className="mt-4 text-2xl font-bold text-red-600">Paiement échoué</h2>
      <p className="mt-2 text-gray-600">
        Le paiement n'a pas pu être traité. Veuillez réessayer.
      </p>
      <Button className="mt-6" onClick={() => (window.location.href = "/cart")}>
        Retour au panier
      </Button>
    </div>
  );
};