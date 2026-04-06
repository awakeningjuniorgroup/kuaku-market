"use client";
import { Suspense } from "react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ShopContent from "@/components/shop";
import { client } from "@/sanity/lib/client";
import { Category, BRANDS_QUERY_RESULT } from "@/sanity.types";


const ShopPage = () => {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const brandSlug = searchParams.get("brand");

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<BRANDS_QUERY_RESULT>([]);

  useEffect(() => {
    // Charger catégories et marques au montage
    const fetchData = async () => {
      const categoriesQuery = `*[_type == "category"]{_id, title, slug}`;
      const brandsQuery = `*[_type == "brand"]{_id, title, slug}`;

      const [cats, brs] = await Promise.all([
        client.fetch(categoriesQuery),
        client.fetch(brandsQuery),
      ]);

      setCategories(cats);
      setBrands(brs);
    };

    fetchData();
  }, []);

  return (
    
     <Suspense
        fallback={
          <ShopContent
        categories={categories}
        brands={brands}
        initialCategory={categorySlug}
        initialBrand={brandSlug}
    />
      }
    
    >
      <ShopContent
      categories={categories}
      brands={brands}
      initialCategory={categorySlug}
      initialBrand={brandSlug}
      />
    </Suspense>
  );
};

export default ShopPage;
