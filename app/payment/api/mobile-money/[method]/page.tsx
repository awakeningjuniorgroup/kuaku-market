// app/payment/[method]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Phone, Copy, Check, Clock, AlertCircle } from "lucide-react";
import { client } from "@/sanity/lib/client";
import toast from "react-hot-toast";

const PaymentPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const method = params.method as string;
  const orderNumber = searchParams.get("order");
  
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes en secondes

  useEffect(() => {
    if (orderNumber) {
      fetchPaymentInfo();
    }
  }, [orderNumber]);

  useEffect(() => {
    // Timer pour l'expiration
    if (timeLeft > 0 && paymentInfo?.status === "pending") {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      toast.error("La session de paiement a expiré");
    }
  }, [timeLeft, paymentInfo]);

  const fetchPaymentInfo = async () => {
    try {
      const data = await client.fetch(
        `*[_type == "paymentSession" && orderNumber == $orderNumber][0]{
          orderNumber,
          amount,
          customerPhone,
          customerName,
          ussdCode,
          qrCode,
          paymentMethod,
          status,
          expiresAt
        }`,
        { orderNumber }
      );
      setPaymentInfo(data);
      
      if (data.expiresAt) {
        const expiryTime = new Date(data.expiresAt).getTime();
        const now = new Date().getTime();
        const remaining = Math.floor((expiryTime - now) / 1000);
        setTimeLeft(remaining > 0 ? remaining : 0);
      }
    } catch (error) {
      console.error("Error fetching payment info:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Code copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payment/status?orderNumber=${orderNumber}`);
      const data = await response.json();
      
      if (data.status === "paid") {
        toast.success("Paiement confirmé ! Redirection...");
        window.location.href = `/success?orderNumber=${orderNumber}`;
      } else {
        toast.loading("En attente de confirmation...");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
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

  if (!paymentInfo) {
    return (
      <Container>
        <div className="max-w-2xl mx-auto py-12">
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Session expirée</h2>
              <p className="text-gray-600 mb-6">
                Cette session de paiement n'existe pas ou a expiré.
              </p>
              <Button onClick={() => window.location.href = "/cart"}>
                Retour au panier
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {method === "mtn" ? "MTN Money" : "Orange Money"}
            </CardTitle>
            <p className="text-gray-600">
              Montant à payer: {paymentInfo.amount.toLocaleString()} FCFA
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Timer d'expiration */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <Clock className="w-5 h-5 text-yellow-600 inline mr-2" />
              <span className="text-yellow-800">
                Temps restant: <strong>{formatTime(timeLeft)}</strong>
              </span>
            </div>

            {/* Méthode 1: USSD */}
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-blue-600" />
                Paiement par USSD
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Composez le code suivant :</p>
                  <div className="flex items-center justify-between">
                    <code className="text-xl font-mono font-bold">
                      {paymentInfo.ussdCode}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(paymentInfo.ussdCode)}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Composez le code USSD ci-dessus sur votre téléphone</li>
                  <li>Suivez les instructions à l'écran</li>
                  <li>Confirmez le paiement avec votre code PIN</li>
                  <li>Attendez la confirmation</li>
                </ol>
              </div>
            </div>

            {/* Méthode 2: QR Code */}
            <div className="border rounded-lg p-6 text-center">
              <h3 className="font-semibold text-lg mb-4 flex items-center justify-center">
                <QrCode className="w-5 h-5 mr-2 text-blue-600" />
                Paiement par QR Code
              </h3>
              
              <div className="flex justify-center mb-4">
                <QRCode
                  value={paymentInfo.qrCode}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              <p className="text-sm text-gray-600">
                Scannez ce QR code avec l'application {method === "mtn" ? "MyMTN" : "Orange Money"}
              </p>
            </div>

            {/* Instructions de vérification */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                Après le paiement :
              </h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Le paiement sera automatiquement confirmé</li>
                <li>Vous recevrez une confirmation par email</li>
                <li>Un QR code de retrait vous sera envoyé</li>
                <li>Vous pouvez suivre votre commande en temps réel</li>
              </ul>
            </div>

            {/* Bouton de vérification */}
            <Button
              onClick={checkPaymentStatus}
              className="w-full"
              variant="outline"
            >
              Vérifier le paiement
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default PaymentPage;