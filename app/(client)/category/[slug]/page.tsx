// app/category/[slug]/page.tsx

import { Category, Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import CategoryProducts from "@/components/CategoryProducts";

interface PageProps {
  params: {
    slug: string;
  };
}

// Générer les chemins statiques pour chaque catégorie
export async function generateStaticParams() {
  const categories: Category[] = await client.fetch(`*[_type == "category"]{slug}`);
  return categories.map((cat) => ({
    slug: cat.slug.current,
  }));
}

// Fonction de page asynchrone qui reçoit params
const CategoryPage = async ({ params }: PageProps) => {
  const slug = params.slug;

  // Récupérer toutes les catégories
  const categories: Category[] = await client.fetch(`*[_type == "category"]{_id, title, slug}`);

  // Récupérer les produits de la catégorie slug
  const productsQuery = `
    *[_type == 'product' && references(*[_type == "category" && slug.current == $slug]._id)] | order(name asc){
      ...,
      "categories": categories[]->title
    }
  `;
  const initialProducts: Product[] = await client.fetch(productsQuery, { slug });

  // Passer les données au composant client
  return (
    <CategoryProducts
      categories={categories}
      initialSlug={slug}
      initialProducts={initialProducts}
    />
  );
};

export default CategoryPage;
