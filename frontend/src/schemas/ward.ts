import { z } from "zod";

export const wardSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  headquarters_town: z.string(),
  is_lga_headquarters: z.boolean(),
  cover_image: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Ward = z.infer<typeof wardSchema>;

export const wardListSchema = z.array(wardSchema);
