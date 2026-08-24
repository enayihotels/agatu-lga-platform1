import { z } from "zod";

// Mirrors AskView's response shape: {"answer": str, "sources": [{"type", "title"}]}
export const askSourceSchema = z.object({
  type: z.string(),
  title: z.string(),
});

export const askResponseSchema = z.object({
  answer: z.string(),
  sources: z.array(askSourceSchema),
});

export type AskResponse = z.infer<typeof askResponseSchema>;
