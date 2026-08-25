import { z } from "zod";

// Mirrors RegisterSerializer's response shape (password is write_only,
// so it's never returned).
export const registerResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
  ward: z.number().nullable(),
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;
