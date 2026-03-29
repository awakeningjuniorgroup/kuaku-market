import { Heart } from 'lucide-react';
import React from 'react'
import { cn } from '@/lib/utils';
import { Product } from '@/sanity.types';


const AddToWishlistButton = ({
    product,
    className,
}: {
    product: Product;
    className?: string;
}) => {
  return (
    <div>
      <div className={cn("absolute top-2 right-2 z-10", className)}>
        <button className={`p-2.5 rounded-full hover:bg-shop_dark_green
             hover:text-white hoverEffect bg-shop_lighter_bg`}>
            <Heart size={20} />
        </button>
        
      </div>
    </div>
  )
}

export default AddToWishlistButton
