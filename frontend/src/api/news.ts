import { api } from "@/api/axios";
import {
  newsFlashListSchema,
  newsPostDetailSchema,
  newsPostListSchema,
} from "@/schemas/news";

export async function listNewsPosts(wardSlug?: string) {
  const response = await api.get("/news/posts/", {
    params: wardSlug ? { ward: wardSlug } : undefined,
  });
  const results = response.data.results ?? response.data;
  return newsPostListSchema.parse(results);
}

export async function getNewsPost(slug: string) {
  const response = await api.get(`/news/posts/${slug}/`);
  return newsPostDetailSchema.parse(response.data);
}

export async function listActiveNewsFlashes() {
  const response = await api.get("/news/flashes/");
  const results = response.data.results ?? response.data;
  return newsFlashListSchema.parse(results);
}
