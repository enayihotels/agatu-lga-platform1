import { z } from "zod";

// Mirrors NewsPostListSerializer -- the lightweight shape used for
// feed/listing views.
export const newsPostListItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  cover_image: z.string().nullable(),
  category_name: z.string().nullable(),
  ward_name: z.string().nullable(),
  author_name: z.string().nullable(),
  published_at: z.string().nullable(),
});

export type NewsPostListItem = z.infer<typeof newsPostListItemSchema>;
export const newsPostListSchema = z.array(newsPostListItemSchema);

// Mirrors NewsPostDetailSerializer.
export const newsPostDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  body: z.string(),
  cover_image: z.string().nullable(),
  category: z.number().nullable(),
  ward: z.number().nullable(),
  author: z.number().nullable(),
  is_published: z.boolean(),
  published_at: z.string().nullable(),
  ai_assisted_draft: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type NewsPostDetail = z.infer<typeof newsPostDetailSchema>;

// Mirrors NewsFlashSerializer -- the homepage ticker feed.
export const newsFlashSchema = z.object({
  id: z.number(),
  headline: z.string(),
  linked_post: z.number().nullable(),
  linked_post_slug: z.string().nullable(),
  priority: z.number(),
  expires_at: z.string().nullable(),
});

export type NewsFlash = z.infer<typeof newsFlashSchema>;
export const newsFlashListSchema = z.array(newsFlashSchema);
