import { client } from './client'

export async function sanityFetch({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>;
}) {
  // On ajoute le troisième argument : les options de fetch.
  // { next: { revalidate: 0 } } force Next.js à ignorer le cache sur Vercel.
  const data = await client.fetch(query, params, {
    next: { revalidate: 0 }, 
  });
  
  return { data };
}

export const SanityLive = () => null;