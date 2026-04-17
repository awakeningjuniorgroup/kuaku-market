// components/OrderQRCode.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode, Download } from "lucide-react";
import Image from "next/image";
import { toPng } from "html-to-image";

interface OrderQRCodeProps {
  orderNumber: string;
  qrCode: string;
  pickupCode: string;
}

export const OrderQRCode = ({ orderNumber, qrCode, pickupCode }: OrderQRCodeProps) => {
  const [showQRModal, setShowQRModal] = useState(false);

  const downloadQRCode = async () => {
    const qrElement = document.getElementById("qr-code-image");
    if (qrElement) {
      const dataUrl = await toPng(qrElement);
      const link = document.createElement("a");
      link.download = `qr-code-${orderNumber}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowQRModal(true)}
        className="flex items-center gap-2"
      >
        <QrCode className="w-4 h-4" />
        Voir QR Code
      </Button>

      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code de retrait</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div id="qr-code-image" className="flex justify-center mb-4">
              <Image
                src={qrCode}
                alt="QR Code"
                width={250}
                height={250}
                className="border rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Code de retrait: <strong className="font-mono">{pickupCode}</strong>
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Présentez ce code au point de retrait
            </p>
            <Button onClick={downloadQRCode} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Télécharger QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};