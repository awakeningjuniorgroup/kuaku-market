"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ShopContent from "@/components/shop";
import { client } from "@/sanity/lib/client";
import { Category, BRANDS_QUERY_RESULT } from "@/sanity.types";

// Create a separate component to handle search params and data fetching
const ShopPageContent = () => {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const brandSlug = searchParams.get("brand");

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<BRANDS_QUERY_RESULT>([]);

  useEffect(() => {
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
    <ShopContent
      categories={categories}
      brands={brands}
      initialCategory={categorySlug}
      initialBrand={brandSlug}
    />
  );
};

const ShopPage = () => {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <ShopPageContent />
    </Suspense>
  );
};

export default ShopPage;
