// pages/category/[slug].tsx

import { Category, Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import CategoryProducts from "@/components/CategoryProducts";

interface PageProps {
  categories: Category[];
  initialSlug: string;
  initialProducts: Product[];
}

export const getStaticPaths = async () => {
  // Récupérer tous les slugs de catégories pour générer les pages statiques
  const categories: Category[] = await client.fetch(`*[_type == "category"]{slug}`);
  const paths = categories.map((cat) => ({
    params: { slug: cat.slug.current },
  }));

  return {
    paths,
    fallback: "blocking", // Génère les pages à la demande si non pré-générées
  };
};

export const getStaticProps = async (context: { params?: { slug?: string } }) => {
  const slug = context.params?.slug || "";

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

  return {
    props: {
      categories,
      initialSlug: slug,
      initialProducts,
    },
    revalidate: 10, // Regénération ISR toutes les 60 secondes
  };
};

const CategoryPage = ({ categories, initialSlug, initialProducts }: PageProps) => {
  return (
    <CategoryProducts
      categories={categories}
      initialSlug={initialSlug}
      initialProducts={initialProducts}
    />
  );
};

export default CategoryPage;
