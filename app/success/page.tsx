// app/shop/page.tsx
import React, { Suspense } from "react";
import ShopContent from "../../components/shop";
import { getCategories, getAllBrands } from "@/sanity/queries";

export default async function ShopPage({ searchParams }: { searchParams: { [key: string]: string } }) {
  const categories = await getCategories();
  const brands = await getAllBrands();

  // On récupère les paramètres directement ici
  const brandParams = searchParams.brand || null;
  const categoryParams = searchParams.category || null;

  return (
    <Suspense fallback={<div>Chargement des produits...</div>}>
      <ShopContent
        categories={categories}
        brands={brands}
        initialCategory={categoryParams}
        initialBrand={brandParams}
      />
    </Suspense>
  );
}
