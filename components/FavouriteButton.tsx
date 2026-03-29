"use client"
import React from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Product } from '@/sanity.types';
import useStore from '@/store';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const FavouriteButton = ({
  showProduct = false,
  product,
}: {
  showProduct?: boolean;
  product?: Product | null | undefined;
}) => {
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
    <>
      {!showProduct ? (

          <Link  href={"/wishlist"} className="group relative">
            <Heart className="w-5 h-5 hover:text-green-700 hoverEffect" />
            <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
              {favoriteProduct?.length ? favoriteProduct?.length : 0}
            </span>
          </Link>
          ) : (
            <button onClick={handleFavorite}
            
              className="group relative hover:text-shop_light_green hoverEffect border
            border-shop_light_green/80 hover:border-shop_light_green p-1.5">
              <Heart className="text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect mt-0.5 h-5" />
            </button>

      )}
    </>
  );
}

export default FavouriteButton
