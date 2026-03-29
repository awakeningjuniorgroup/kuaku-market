import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "sanity/envkey.ts";

// Read-only client for fetching data (uses CDN for better performance)


// Write client for mutations (authenticated) - Use this for create, update, delete operations
export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Don't use CDN for write operations
  token: process.env.SANITY_API_TOKEN, // Server-side token with write permissions
});