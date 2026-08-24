import { z } from "zod";

// Mirrors EventSerializer.
export const eventSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  location: z.string(),
  ward: z.number().nullable(),
  ward_name: z.string().nullable(),
  starts_at: z.string(),
  ends_at: z.string().nullable(),
  cover_image: z.string().nullable(),
  is_public: z.boolean(),
  rsvp_count: z.number(),
  is_user_attending: z.boolean(),
});

export type Event = z.infer<typeof eventSchema>;
export const eventListSchema = z.array(eventSchema);
