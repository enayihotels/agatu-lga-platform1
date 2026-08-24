import { api } from "@/api/axios";
import { newsFlashSchema, newsPostDetailSchema } from "@/schemas/news";

export interface NewsPostInput {
  title: string;
  excerpt: string;
  body: string;
  category: number | null;
  ward: number | null;
  is_published: boolean;
}

export async function createNewsPost(input: NewsPostInput) {
  const response = await api.post("/news/posts/", input);
  return newsPostDetailSchema.parse(response.data);
}

export async function updateNewsPost(slug: string, input: Partial<NewsPostInput>) {
  const response = await api.patch(`/news/posts/${slug}/`, input);
  return newsPostDetailSchema.parse(response.data);
}

export interface NewsFlashInput {
  headline: string;
  linked_post: number | null;
  priority: number;
  expires_at: string | null;
}

export async function createNewsFlash(input: NewsFlashInput) {
  const response = await api.post("/news/flashes/", input);
  return newsFlashSchema.parse(response.data);
}

export async function updateNewsFlash(id: number, input: Partial<NewsFlashInput>) {
  const response = await api.patch(`/news/flashes/${id}/`, input);
  return newsFlashSchema.parse(response.data);
}

export async function deleteNewsFlash(id: number) {
  await api.delete(`/news/flashes/${id}/`);
}
