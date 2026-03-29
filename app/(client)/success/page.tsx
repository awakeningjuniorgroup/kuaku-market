// app/success/SuccessPageContent.tsx
"use client";

import React, { useEffect } from "react";
import useStore from "@/store";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Check, Home, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";

const SuccessPageContent = () => {
  const { user } = useUser();
  const { resetCart } = useStore();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const orderNumber = searchParams.get("orderNumber");

  useEffect(() => {
    if (session_id) {
      resetCart();
    }
  }, [session_id, resetCart]);

  return (
    <div className="flex py-5 bg-gradient-to-br from-gray-50 to-gray-100 items-center justify-center mx-4">
      <div className="flex flex-col gap-8 bg-gray-50 rounded-2xl shadow-2xl p-6 max-w-xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <Check className="w-10 h-10 text-green-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-green-500 mb-4">
          Order Confirmed!
        </h1>
        <div className="pr-4 items-center space-y-4 mb-4">
          <p className="text-gray-700">
            Thank you for your purchase. We are processing your order and will
            ship it soon. A confirmation email with your order details will be
            sent to your inbox shortly.
          </p>
          <p className="text-green-500">
            Order Number:{" "}
            <span className="text-black font-semibold">{orderNumber}</span>
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-green-500 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-shop-light_green text-green-500 rounded-lg hover:bg-shop-darkColor transition-all duration-300 shadow-md"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Shop
          </Link>
          <Link
            href="/orders"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-green-500 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <Package className="w-5 h-5 mr-2" />
            Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPageContent;
