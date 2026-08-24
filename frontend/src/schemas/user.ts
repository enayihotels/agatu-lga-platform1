import { z } from "zod";

export const userRoleSchema = z.enum([
  "super_admin",
  "content_editor",
  "ward_officer",
  "verified_resident",
  "diaspora_member",
  "service_account",
]);
export type UserRole = z.infer<typeof userRoleSchema>;

// Mirrors UserProfileSerializer -- returned by GET /api/accounts/me/.
export const userProfileSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  role: userRoleSchema,
  phone_number: z.string(),
  ward: z.number().nullable(),
  ward_name: z.string().nullable(),
  is_phone_verified: z.boolean(),
  receives_sms_alerts: z.boolean(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// Response shape from POST /api/auth/token/.
export const tokenPairSchema = z.object({
  access: z.string(),
  refresh: z.string(),
});

export type TokenPair = z.infer<typeof tokenPairSchema>;
