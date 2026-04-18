import React from 'react';
import { Title } from './text';
import { Category } from '@/sanity.types';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';

interface HomeCategoriesProps {
  categories: Category[];
}

const HomeCategories: React.FC<HomeCategoriesProps> = ({ categories }) => {
  return (
    <div className="bg-white border border-shop_light_green my-10 md:my-20 p-5 md:p-10 rounded-lg">
      <Title className="border-b pb-3">Categorie populaire</Title>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories?.map((category) => (
          <div
            key={category?._id}
            className="bg-shop_light_bg p-5 flex items-center gap-3 cursor-pointer"
          >
            {category?.image && (
              <div className="overflow-hidden border border-shop_light_Orange/30 hover:border-shop_light_Orange hoverEffect w-20 h-20 p-1">
                <Link
                  href={{
                    pathname: '/shop',
                    query: { category: category?.slug?.current },
                  }}
                  className="block w-full h-full"
                >
                  <Image
                    src={urlFor(category?.image).url()}
                    alt={category?.title || 'category image'}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain group-hover:scale-110 hoverEffect"
                  />
                </Link>
              </div>
            )}
            <div className="space-y-2">
              <h3 className="text-base font-semibold">{category?.title}</h3>
              <p className="text-sm">
                <span className="font-bold text-shop_light_green">
                  {`(${(category as unknown as { productCount?: number }).productCount ?? 0})`}
                </span>{' '}
                items Available
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
