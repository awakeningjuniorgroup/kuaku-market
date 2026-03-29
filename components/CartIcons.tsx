"use client";

import useStore from "@/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";

const CartIcons = () => {
  // Call useStore as a function to get the store state
  const { items } = useStore();

  return (
    <Link href="/cart" className="group relative">
      <ShoppingBag className="w-5 h-5 hover:text-green-700 hoverEffect" />
      <span
        className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center"
      >
        {items?.length}
      </span>
    </Link>
  );
};


export default CartIcons
