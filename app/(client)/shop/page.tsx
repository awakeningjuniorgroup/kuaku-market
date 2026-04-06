import React from "react";
import ShopContent from "@/components/ShopContent";
import { client } from "@/sanity/lib/client";

interface Props {
  searchParams: { category?: string; brand?: string };
}

const ShopPage = async ({ searchParams }: Props) => {
  const categorySlug = searchParams.category || null;
  const brandSlug = searchParams.brand || null;

  const categories = await client.fetch(`*[_type == "category"]{_id, title, slug}`);
  const brands = await client.fetch(`*[_type == "brand"]{_id, title, slug}`);

  return (
    <ShopContent
      categories={categories}
      brands={brands}
      initialCategory={categorySlug}
      initialBrand={brandSlug}
    />
  );
};

export default ShopPage;
