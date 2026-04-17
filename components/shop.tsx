"use client";

import React, { useEffect, useState } from "react";
import { Category, Product, BRANDS_QUERY_RESULT } from "@/sanity.types";
import Container from "./Container";
import { Title } from "./text";
import CategoryList from "./shop/CategoryList";
import BrandList from "./shop/BrandList";
import PriceList from "./shop/PriceList";
import { client } from "@/sanity/lib/client";
import { Loader2, Filter, X } from "lucide-react";
import { NoProductAvailable } from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";

interface Props {
  categories: Category[];
  brands: BRANDS_QUERY_RESULT;
  initialCategory: string | null;
  initialBrand: string | null;
}

const ShopContent = ({
  categories,
  brands,
  initialCategory,
  initialBrand,
}: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    initialBrand || null
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let minPrice = 0;
        let maxPrice = 50000;
        if (selectedPrice) {
          const [min, max] = selectedPrice.split("-").map(Number);
          minPrice = min;
          maxPrice = max;
        }

        const query = `
          *[_type == 'product'
            && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
            && (!defined($selectedBrand) || references(*[_type == "brand" && slug.current == $selectedBrand]._id))
            && price >= $minPrice && price <= $maxPrice
            && (!defined($searchQuery) || name match $searchQuery || description match $searchQuery)
          ]
          | order(name asc) {
            ...,
            "categories": categories[]->title
          }
        `;

        const data = await client.fetch(
          query,
          {
            selectedCategory,
            selectedBrand,
            minPrice,
            maxPrice,
            searchQuery: searchQuery ? `${searchQuery}*` : null,
          },
          { next: { revalidate: 0 } }
        );

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedBrand, selectedPrice, searchQuery]);

  return (
    <div className="border-t">
      <Container className="mt-5">
        <Container className="mt-5">
          <div className="sticky top-0 z-10 mb-5">
            <div className="flex items-center justify-between gap-3">
              <Title className="text-lg uppercase tracking-wide">
                Obtenir les produits comme vous aimez
              </Title>

              <div className="flex items-center gap-2">
                {/* Filter button - visible only on small screens */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 px-3 py-2 bg-shop_dark_green text-white rounded hover:bg-shop_dark_green/80 hoverEffect text-sm font-medium"
                >
                  {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                  {showFilters ? "close" : "Filters"}
                </button>

                {(selectedCategory !== null ||
                  selectedBrand !== null ||
                  selectedPrice !== null) && (
                  <button
                    onClick={() => {
                      setSelectedBrand(null);
                      setSelectedCategory(null);
                      setSelectedPrice(null);
                    }}
                    className="text-shop_dark_green underline text-sm mt-0 font-medium hover:text-red-900 hoverEffect whitespace-nowrap"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
            {/* Sidebar - toggleable on mobile, always visible on md+ */}
            <div
              className={`md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 border-r border-r-shop_btn_dark_green/50 transition-all duration-300 ${
                showFilters ? "block" : "hidden md:block"
              }`}
            >
              {/* Search Bar */}
              <div className="mb-5 px-3">
                <SearchBar value={searchQuery} onChange={(value) => setSearchQuery(value)} />
              </div>

              {/* Category list */}
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />

              {/* Brand list */}
              <BrandList
                brands={brands}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
              />

              {/* Price list */}
              <PriceList selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice} />
            </div>

            <div className="flex-1 pt-5">
              <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2">
                {loading ? (
                  <div className="p-20 flex flex-col gap-2 items-center justify-between bg-white">
                    <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
                    <p className="font-semibold tracking-wide text-base">Product loading ...</p>
                  </div>
                ) : (
                  <div>
                    {products.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                        {products.map((product) => (
                          <ProductCard key={product._id} product={product} />
                        ))}
                      </div>
                    ) : (
                      <NoProductAvailable className="bg-white mt-0" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Container>
    </div>
  );
};

export default ShopContent;
