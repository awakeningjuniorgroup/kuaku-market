// components/CartItemList.tsx
"use client";

import { Button } from "@/components/ui/button";
import PriceFormatter from "@/components/PriceFormatter";
import ProductSideMenu from "@/components/ProductSideMenu";
import QuantityButtons from "@/components/QuantityButtons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { urlFor } from "@/sanity/lib/image";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

interface CartItem {
  product: any;
  quantity: number;
}

interface CartItemListProps {
  groupedItems: CartItem[];
  getItemCount: (id: string) => number;
  deleteCartProduct: (id: string) => void;
  onResetCart: () => void;
}

const CartItemList = ({
  groupedItems,
  getItemCount,
  deleteCartProduct,
  onResetCart,
}: CartItemListProps) => {
  return (
    <div className="border bg-white rounded-md">
      {groupedItems?.map(({ product }) => {
        const itemCount = getItemCount(product?._id);
        return (
          <div
            key={product?._id}
            className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
          >
            <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
              {product?.images && (
                <Link
                  href={`/product/${product?.slug?.current}`}
                  className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
                >
                  <Image
                    src={urlFor(product?.images[0]).url()}
                    alt="productImage"
                    width={500}
                    height={500}
                    loading="lazy"
                    className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                  />
                </Link>
              )}
              <div className="h-full flex flex-1 flex-col justify-between py-1">
                <div className="flex flex-col gap-0.5 md:gap-1.5">
                  <h2 className="text-base font-semibold line-clamp-1">
                    {product?.name}
                  </h2>
                  <p className="text-sm capitalize">
                    Variant:{" "}
                    <span className="font-semibold">{product?.type}</span>
                  </p>
                  <p className="text-sm capitalize">
                    Status:{" "}
                    <span className="font-semibold">{product?.status}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <ProductSideMenu
                          product={product}
                          className="relative top-0 right-0"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="font-bold">
                        Add to Favorite
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Trash
                          onClick={() => {
                            deleteCartProduct(product?._id);
                            toast.success("Product deleted successfully!");
                          }}
                          className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="font-bold bg-red-600">
                        Delete product
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
              <PriceFormatter
                amount={(product?.price as number) * itemCount}
                className="font-bold text-lg"
              />
              <QuantityButtons product={product} />
            </div>
          </div>
        );
      })}
      <Button
        onClick={onResetCart}
        className="m-5 font-semibold"
        variant="destructive"
      >
        Reset Cart
      </Button>
    </div>
  );
};

export default CartItemList;