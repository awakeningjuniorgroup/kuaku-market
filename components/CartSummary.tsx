// components/CartSummary.tsx
"use client";

import { Button } from "@/components/ui/button";
import PriceFormatter from "@/components/PriceFormatter";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  subTotal: number;
  total: number;
  onCheckout: () => void;
  isLoading: boolean;
  isMobile?: boolean;
}

const CartSummary = ({
  subTotal,
  total,
  onCheckout,
  isLoading,
  isMobile = false,
}: CartSummaryProps) => {
  const discount = subTotal - total;

  const SummaryContent = () => (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>SubTotal</span>
          <PriceFormatter amount={subTotal} />
        </div>
        <div className="flex items-center justify-between">
          <span>Discount</span>
          <PriceFormatter amount={discount} />
        </div>
        <Separator />
        <div className="flex items-center justify-between font-semibold text-lg">
          <span>Total</span>
          <PriceFormatter amount={total} className="text-lg font-bold text-black" />
        </div>
        <Button
          className="w-full rounded-full font-semibold tracking-wide hoverEffect"
          size="lg"
          disabled={isLoading}
          onClick={onCheckout}
        >
          {isLoading ? "Please wait..." : "Proceed to Checkout"}
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-white pt-2">
        <div className="bg-white p-4 rounded-lg border mx-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <SummaryContent />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <SummaryContent />
    </div>
  );
};

export default CartSummary;