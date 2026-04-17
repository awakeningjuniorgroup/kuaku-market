"use client";

import React from "react";
import { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import useStore from "@/store";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount } = useStore();
  const router = useRouter();

  const itemCount = getItemCount(product?._id);
  const stock = typeof product?.stock === "number" ? product.stock : 0;
  const isOutOfStock = stock === 0;

  const handleAddToCart = async () => {
    if (itemCount < stock) {
      try {
        await addItem(product); // Ajout asynchrone dans le store
        toast.success("Product added successfully!");
        router.push("/cart"); // Redirection vers le panier
      } catch (error) {
        toast.error("Failed to add item to cart.");
        console.error("Add to cart error:", error);
      }
    } else {
      toast.error("Cannot add more than available stock");
    }
  };

  return (
    <div className="h-10 flex items-center">
      {itemCount > 0 ? (
        <div className="w-full text-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-darkColor/60">Quantity:</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter amount={product?.price ? product.price * itemCount : 0} />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full  p-3 bg-shop_dark_green/80 text-shop_light_bg shadow-none border border-shop_dark_green/80 font-semibold tracking-wide hover:text-white hover:bg-shop_dark_green/90 hover:border-shop_dark_green/90 disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 hoverEffect",
            className
          )}
        >
          <ShoppingBag /> {isOutOfStock ? "Stock ecoulé" : "Ajouter au panier"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
