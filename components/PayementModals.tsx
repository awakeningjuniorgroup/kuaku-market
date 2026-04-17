// components/PayementModals.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import PriceFormatter from "@/components/PriceFormatter";

type PaymentMethod = "mtn" | "orange" | null;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (method: PaymentMethod, phone: string) => void;
  totalAmount: number;
  isLoading: boolean;
}

const PaymentModal = ({
  isOpen,
  onClose,
  onConfirm,
  totalAmount,
  isLoading,
}: PaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleConfirm = () => {
    if (!selectedMethod) {
      alert("Veuillez sélectionner un mode de paiement");
      return;
    }
    if (!phoneNumber || phoneNumber.length < 8) {
      alert("Veuillez entrer un numéro de téléphone valide");
      return;
    }
    onConfirm(selectedMethod, phoneNumber);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Paiement Mobile Money</DialogTitle>
          <DialogDescription>
            Choisissez votre mode de paiement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <RadioGroup
            value={selectedMethod || ""}
            onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="mtn" id="mtn" className="peer sr-only" />
              <Label
                htmlFor="mtn"
                className="flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-green-600"
              >
                <span className="text-2xl mb-2">📱</span>
                <span className="font-semibold">MTN Money</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="orange" id="orange" className="peer sr-only" />
              <Label
                htmlFor="orange"
                className="flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-green-600"
              >
                <span className="text-2xl mb-2">🟠</span>
                <span className="font-semibold">Orange Money</span>
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <input
              id="phone"
              type="tel"
              placeholder="699999999"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500">
              Entrez le numéro sans indicatif (ex: 699999999)
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between">
              <span>Total à payer :</span>
              <PriceFormatter amount={totalAmount} className="font-bold" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !selectedMethod || !phoneNumber}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Chargement..." : "Payer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;