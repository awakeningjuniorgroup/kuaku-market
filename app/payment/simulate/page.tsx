// app/payment/simulate/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// Composant principal qui utilise useSearchParams
function SimulatePaymentContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const amount = searchParams.get("amount");
  const method = searchParams.get("method");
  
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Code USSD copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const merchantCode = Math.floor(Math.random() * 1000000);
  const ussdCode = method === "mtn"
    ? `*126*${merchantCode}*${amount}#`
    : `#144*${merchantCode}*${amount}#`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-green-500 p-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">Paiement prêt !</h1>
          <p className="text-green-100 mt-1">Mode développement - Test réussi</p>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-green-600">
              {Number(amount).toLocaleString()} FCFA
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-500">Mode de paiement</span>
              <span className="font-semibold">{method === 'mtn' ? '📱 MTN Money' : '🟠 Orange Money'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-500">Commande</span>
              <span className="font-mono text-sm">{orderNumber?.substring(0, 8)}...</span>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Code USSD à composer</span>
              <button 
                onClick={() => copyToClipboard(ussdCode)}
                className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <code className="text-xl font-mono font-bold text-gray-800">{ussdCode}</code>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Composez ce code sur votre téléphone et suivez les instructions
            </p>
          </div>
          
          <div className="mt-6 space-y-3">
            <Link href={`/success?orderNumber=${orderNumber}&sim=true`}>
              <Button className="w-full bg-green-500 hover:bg-green-600">
                ✅ Confirmer la commande
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" className="w-full">
                🔄 Annuler et retourner
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant wrapper avec Suspense
export default function SimulatePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <SimulatePaymentContent />
    </Suspense>
  );
}