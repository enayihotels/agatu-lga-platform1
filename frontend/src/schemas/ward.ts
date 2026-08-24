import { z } from "zod";

// Mirrors WardListSerializer -- the lightweight directory list shape.
export const wardListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  headquarters_town: z.string(),
  is_lga_headquarters: z.boolean(),
  cover_image: z.string().nullable(),
});

export type WardListItem = z.infer<typeof wardListItemSchema>;
export const wardListSchema = z.array(wardListItemSchema);

// Mirrors WardContactSerializer.
export const wardContactSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  role_title: z.string(),
  phone_number: z.string(),
  email: z.string(),
});

// Mirrors ClanSerializer.
export const clanSchema = z.object({
  id: z.number(),
  name: z.string(),
  notes: z.string(),
});

// Mirrors WardDetailSerializer -- includes nested contacts/clans, no
// created_at/updated_at (those aren't exposed by this serializer).
export const wardDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  headquarters_town: z.string(),
  is_lga_headquarters: z.boolean(),
  cover_image: z.string().nullable(),
  contacts: z.array(wardContactSchema),
  clans: z.array(clanSchema),
});

export type WardDetail = z.infer<typeof wardDetailSchema>;
