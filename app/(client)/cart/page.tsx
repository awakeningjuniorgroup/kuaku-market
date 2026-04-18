// app/cart/page.tsx
"use client";

import { createCheckoutSession } from "@/actions/CreateCheckoutSession";
import type { Metadata } from "@/actions/CreateCheckoutSession";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import { Title } from "@/components/text";
import { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import useStore from "@/store";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddressForm, { AddressFormData } from "@/components/AddressForms";
import CartItemList from "@/components/CartItemsList";
import CartSummary from "@/components/CartSummary";
import PaymentModal from "@/components/PayementModals";

type PaymentMethod = "mtn" | "orange" | null;

export default function CartPage() {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();
  
  const [loading, setLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const query = `*[_type=="address"] | order(publishedAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);
      const defaultAddress = data.find((addr: Address) => addr.default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    } catch (error) {
      console.log("Addresses fetching error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAddresses();
  }, []);

  const handleResetCart = () => {
    const confirmed = window.confirm("Are you sure you want to reset your cart?");
    if (confirmed) {
      resetCart();
      toast.success("Cart reset successfully!");
    }
  };

  const handleOpenPaymentModal = () => {
    if (!selectedAddress) {
      toast.error("Veuillez d'abord renseigner votre adresse de livraison");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async (paymentMethod: PaymentMethod, phoneNumber: string) => {
    setPaymentLoading(true);
    
    try {
      const orderNumber = crypto.randomUUID();
      
      const metadata: Metadata = {
        orderNumber: orderNumber,
        customerName: selectedAddress?.name || "Guest Customer",
        customerEmail: `${selectedAddress?.name?.replace(/\s/g, '').toLowerCase()}@example.com`,
        address: selectedAddress,
        paymentMethod: paymentMethod,
        paymentPhone: phoneNumber,
      };
      
      console.log("📤 Appel de createCheckoutSession avec:", metadata);
      
      const result = await createCheckoutSession(groupedItems, metadata);
      
      console.log("📥 Résultat reçu:", result);
      
      if (result && typeof result.paymentUrl === 'string') {
        console.log("🔗 Redirection vers:", result.paymentUrl);
        toast.success("Paiement initié avec succès !");
        
        if (result.ussdCode) {
          toast.success(`Code USSD: ${result.ussdCode}`, { duration: 10000 });
        }
        
        window.location.href = result.paymentUrl;
      } else {
        console.error("paymentUrl n'est pas une string:", result);
        toast.error("Erreur: URL de paiement invalide");
      }
      
    } catch (error) {
      console.error("❌ Error processing payment:", error);
      toast.error("Erreur lors du traitement du paiement. Veuillez réessayer.");
    } finally {
      setPaymentLoading(false);
      setShowPaymentModal(false);
    }
  };

  const handleSaveNewAddress = (formData: AddressFormData) => {
    const newAddr = {
      _id: crypto.randomUUID(),
      name: formData.name,
      address: formData.quartier || "",
      city: formData.ville,
      state: formData.pays,
      phone: `${formData.phoneCode} ${formData.phone}`,
      default: false,
    } as unknown as Address;

    setAddresses((prev) => (prev ? [newAddr, ...prev] : [newAddr]));
    setSelectedAddress(newAddr);
  };

  // Éviter l'erreur d'hydratation
  if (!mounted) {
    return null;
  }

  if (!groupedItems?.length) {
    return <EmptyCart />;
  }

  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      <Container>
        <div className="flex items-center gap-2 py-5">
          <ShoppingBag className="w-6 h-6" />
          <Title>Shopping Cart</Title>
        </div>

        <div className="grid lg:grid-cols-3 md:gap-8">
          <div className="lg:col-span-2 rounded-lg">
            <CartItemList
              groupedItems={groupedItems}
              getItemCount={getItemCount}
              deleteCartProduct={deleteCartProduct}
              onResetCart={handleResetCart}
            />
          </div>

          <div className="flex flex-col gap-5">
            <AddressForm 
              onSave={handleSaveNewAddress}
              showCancelButton={false}
            />

            <CartSummary
              subTotal={getSubTotalPrice()}
              total={getTotalPrice()}
              onCheckout={handleOpenPaymentModal}
              isLoading={loading}
            />
          </div>

          <CartSummary
            subTotal={getSubTotalPrice()}
            total={getTotalPrice()}
            onCheckout={handleOpenPaymentModal}
            isLoading={loading}
            isMobile={true}
          />
        </div>

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePaymentConfirm}
          totalAmount={getTotalPrice()}
          isLoading={paymentLoading}
        />
      </Container>
    </div>
  );
}