"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/sanity.types";
import { Heart } from "lucide-react";
import useStore from "@/store";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  className?: string;
}

const ProductSideMenu = ({ product, className }: Props) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const availableProduct = favoriteProduct?.find(
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableProduct || null);
  }, [product, favoriteProduct]);

  const handleFavorite = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!product?._id) {
      toast.error("Invalid product");
      return;
    }

    try {
      await addToFavorite(product);
      toast.success(
        existingProduct
          ? "Product removed successfully!"
          : "Product added successfully!"
      );
    } catch (error) {
      console.error("Failed to update favorite:", error);
      toast.error("Failed to update favorites");
    }
  };

  return (
    <div className={cn(" hover:cursor-pointer absolute top-2 right-2", className)}>
      <div
        onClick={handleFavorite}
        className={`p-2.5 rounded-full  hover:bg-shop_dark_green/80 
            hover:text-white cursor-pointer ${existingProduct ? "bg-shop_dark_green/80 text-white" : "bg-lightColor/10" }`}
      >
        <Heart size={15} stroke="currentColor" />
      </div>
    </div>
  );
};

export default ProductSideMenu;
