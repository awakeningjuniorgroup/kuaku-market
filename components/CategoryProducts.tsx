// pages/brands.tsx
import React from 'react';
import { client } from '@/sanity/lib/client';

interface Brand {
  _id: string;
  title: string;
  slug: { current: string };
  // ajoutez d'autres champs selon votre schéma Sanity
}

interface BrandsPageProps {
  brands: Brand[];
}

export async function getStaticProps() {
  const query = `*[_type == "brand" && defined(slug.current)]{
    _id,
    title,
    slug,
    // ajoutez ici les autres champs nécessaires
  }`;

  const brands: Brand[] = await client.fetch(query);

  return {
    props: {
      brands,
    },
    revalidate: 1, // ISR : régénère la page toutes les 60 secondes
  };
}

const BrandsPage: React.FC<BrandsPageProps> = ({ brands }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nos Marques</h1>
      {brands.length === 0 ? (
        <p>Aucune marque disponible pour le moment.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <li key={brand._id} className="border p-4 rounded shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold">{brand.title}</h2>
              {/* Ajoutez ici d'autres informations sur la marque si besoin */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BrandsPage;
