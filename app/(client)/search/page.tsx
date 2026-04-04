"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { NoProductAvailable } from "@/components/NoProductAvailable";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const searchQuery = `*[_type == "product" && name match "*${query}*"] | order(name asc){\n          ...,"categories": categories[]->title\n        }`;
        const results = await client.fetch(searchQuery);
        setProducts(results);
      } catch (error) {
        console.log("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Résultats de recherche
        </h1>
        <p className="text-gray-600">
          {query && (
            <>
              Recherche pour: <span className="font-semibold text-shop_light_green">"{query}"</span>
            </>
          )}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <motion.div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Recherche en cours...</span>
          </motion.div>
        </div>
      ) : products?.length > 0 ? (
        <>
          <p className="text-gray-600 mb-6">
            {products.length} produit{products.length !== 1 ? "s" : ""} trouvé{products.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {products?.map((product) => (
              <AnimatePresence key={product?._id}>
                <motion.div
                  layout
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductCard key={product?._id} product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        </>
      ) : query ? (
        <NoProductAvailable selectedTab={`résultats pour "${query}"`} />
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">Entrez un terme de recherche pour commencer</p>
        </div>
      )}
    </Container>
  );
};

export default SearchPage;