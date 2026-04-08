// app/category/[slug]/page.tsx

import { Category, Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import CategoryProducts from "@/components/CategoryProducts";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const categories: Category[] = await client.fetch(`*[_type == "category"]{slug}`);
  return categories.map((cat) => ({
    slug: cat?.slug?.current,
  }));
}

const CategoryPage = async ({ params }: PageProps) => {
  const slug = params.slug;
  if (!slug) {
    throw new Error("Slug parameter is missing");
  }

  const categories: Category[] = await client.fetch(`*[_type == "category"]{_id, title, slug}`);

  const productsQuery = `
    *[_type == 'product' && references(*[_type == "category" && slug.current == $slug]._id)] | order(name asc){
      ...,
      "categories": categories[]->title
    }
  `;

  const initialProducts: Product[] = await client.fetch(productsQuery, { slug });

  return (
    <CategoryProducts
      categories={categories}
      initialSlug={slug}
      initialProducts={initialProducts}
    />
  );
};

export default CategoryPage;
