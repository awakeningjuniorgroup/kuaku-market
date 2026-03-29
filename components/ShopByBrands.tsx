import React from "react";
import { Title } from "./text";
import Link from "next/link";
import { getAllBrands } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { GitCompareArrows, PhoneCallIcon, ShieldCheck, Truck } from "lucide-react";


const extraData = [
    {
        title: "Delivery",
        description: "Free shipping over 100000 FCFA",
        icon: <Truck size={45} />
    },
     {
        title: "Free Return",
        description: "Free shipping over 100000 FCFA",
        icon: <GitCompareArrows size={45} />
    },
     {
        title: "Customer Support",
        description: "Friendly 24/7 customer support",
        icon: <PhoneCallIcon size={45} />
    },
     {
        title: "Money Back guarantee",
        description: "Quality checked by our team",
        icon: <ShieldCheck size={45} />
    }, 
    
]

const ShopByBrands = async () => {
  const brands = await getAllBrands();

  return (
    <div className="mb-10 lg:pb-20 bg-shop_light_bg p-5 lg:p-7 rounded-md">
      <div className="flex items-center gap-5 justify-between mb-10">
        <Title>Shop by Brands</Title>
        <Link
          href="/shop"
          className="text-sm font-semibold tracking-wide hover:text-shop_btn_dark_green hoverEffect"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-5">
        {brands?.map((brand) => (
          <Link
            key={brand?.slug?.current}
            href={{pathname:"/shop", query: { brand: brand?.slug?.current}}}
            className="bg-white w-36 h-24 flex flex-wrap items-center 
             justify-center rounded-md overflow-hidden shadow-shop_dark_green/20 hoverEffect"
          >
            {brand?.image && (
              <Image
                src={urlFor(brand?.image).url()}
                alt={ "Brand image"}
                width={250}
                height={250}
                className="w-32 h-20 object-contain"
                loading="lazy"
              />
            )}
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 
        lg:grid-cols-4 py-5 shadow-shop_light_green/20 mt-16 p-2">
        {extraData.map((item, index) => (
            <div key={index} 
                className="flex items-center gap-3 group text-lightColor
                hover:bg-shop_light_green rounded-md p-3 transition-colors duration-300">
                    <span className="inline-flex scale-100 group-hover:scale-90 hoverEffect">{item?.icon}</span>
            <div/>
            <div className="text-sm">
                <p className="font-bold text-darkColor/80 capitalize">{item?.title}</p>
                <p className="text-lightColor">{item?.description}</p>
            </div>
           
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopByBrands;
