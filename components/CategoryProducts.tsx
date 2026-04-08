// components/CategoryProducts.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Category, Product } from "@/sanity.types";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import { NoProductAvailable } from "./NoProductAvailable";

interface Props {
  categories: Category[];
  initialSlug: string;
  initialProducts: Product[];
}

const CategoryProducts = ({ categories, initialSlug, initialProducts }: Props) => {
  const [currentSlug, setCurrentSlug] = useState(initialSlug);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fonction pour récupérer les produits côté client lors du changement de catégorie
  const fetchProducts = async (categorySlug: string) => {
    setLoading(true);
    try {
      const query = `
        *[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc){
          ...,
          "categories": categories[]->title
        }
      `;
      const data: Product[] = await client.fetch(query, { categorySlug });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Gestion du changement de catégorie
  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    router.push(`/category/${newSlug}`, { scroll: false });
  };

  // Effet pour récupérer les produits quand currentSlug change (client-side)
  useEffect(() => {
    // Ne pas recharger si c'est la catégorie initiale déjà chargée
    if (currentSlug === initialSlug) {
      setProducts(initialProducts);
      return;
    }
    fetchProducts(currentSlug);
  }, [currentSlug, initialSlug, initialProducts]);

  return (
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      <div className="flex flex-col md:min-w-40 border">
        {categories.map((item) => (
          <Button
            key={item._id}
            onClick={() => handleCategoryChange(item.slug.current)}
            className={`bg-transparent border-0 p-0 rounded-none text-darkColor shadow-none hover:bg-shop_orange hover:text-white font-semibold hoverEffect border-b last:border-b-0 transition-colors capitalize ${
              item.slug.current === currentSlug ? "bg-shop_orange text-white border-shop_orange" : ""
            }`}
          >
            <p className="w-full text-left px-2">{item.title}</p>
          </Button>
        ))}
      </div>
      <div className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full">
            <div className="flex items-center space-x-2 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Product is loading...</span>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {products.map((product) => (
              <AnimatePresence key={product._id}>
                <motion.div>
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          <NoProductAvailable selectedTab={currentSlug} className="mt-0 w-full" />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
