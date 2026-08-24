import { z } from "zod";

// These mirror the history app's models field-for-field (full
// passthrough), matching the pattern every other serializer in this
// project follows. Worth double-checking against the actual
// apps/history/serializers.py output once the frontend is wired to
// real data, in case any field was intentionally excluded there.

export const leaderSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  title: z.string(),
  portrait: z.string().nullable(),
  start_year: z.number(),
  end_year: z.number().nullable(),
  biography: z.string(),
  achievements: z.string(),
  ward: z.number().nullable(),
  is_current: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Leader = z.infer<typeof leaderSchema>;
export const leaderListSchema = z.array(leaderSchema);

export const historicalEventSchema = z.object({
  id: z.number(),
  title: z.string(),
  year: z.number(),
  month: z.number().nullable(),
  summary: z.string(),
  image: z.string().nullable(),
  related_leader: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type HistoricalEvent = z.infer<typeof historicalEventSchema>;
export const historicalEventListSchema = z.array(historicalEventSchema);

export const cultureCategorySchema = z.enum([
  "language",
  "festival",
  "proverb",
  "folklore",
  "custom",
]);
export type CultureCategory = z.infer<typeof cultureCategorySchema>;

export const cultureEntrySchema = z.object({
  id: z.number(),
  category: cultureCategorySchema,
  title: z.string(),
  slug: z.string(),
  local_text: z.string(),
  english_meaning: z.string(),
  context_notes: z.string(),
  audio_pronunciation: z.string().nullable(),
  image: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type CultureEntry = z.infer<typeof cultureEntrySchema>;
export const cultureEntryListSchema = z.array(cultureEntrySchema);
