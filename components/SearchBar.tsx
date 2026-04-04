"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { Product } from '@/sanity.types';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length === 0) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const queryStr = `*[_type == "product" && name match "*${searchTerm}*"] | order(name asc)[0...5]{
          _id,
          name,
          slug,
          price,
          images,
          discount
        }`;
        const results = await client.fetch(queryStr);
        setSuggestions(results);
        setIsOpen(true);
      } catch (error) {
        console.log('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  const handleProductClick = (slug: string) => {
    setSearchTerm('');
    setIsOpen(false);
    router.push(`/product/${slug}`);
  };

  return (
    <div ref={searchRef} className="relative w-full md:w-64">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Chercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setIsOpen(true)}
          className="w-full px-4 py-2 pr-10 text-sm border border-shop_light_green/30 rounded-full focus:outline-none focus:border-shop_light_green/70 transition"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-shop_light_green hover:text-shop_dark_green transition"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {isOpen && (searchTerm.trim().length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-shop_light_green/30 rounded-lg shadow-lg z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Recherche en cours...</div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {suggestions.map((product) => (
                <li key={product._id}>
                  <button
                    type="button"
                    onClick={() => handleProductClick(product.slug?.current || '')}
                    className="w-full px-4 py-3 text-left hover:bg-shop_light_green/10 transition flex items-center gap-3 border-b border-shop_light_green/10 last:border-0"
                  >
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0]?.asset?.url || ''}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-shop_light_green font-semibold">{product.price} FCFA</p>
                    </div>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full px-4 py-2 text-center text-sm text-shop_light_green hover:bg-shop_light_green/10 font-medium transition border-t border-shop_light_green/10"
                >
                  Voir tous les résultats
                </button>
              </li>
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              Aucun produit trouvé pour "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
