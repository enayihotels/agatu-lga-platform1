import { z } from "zod";

export const reportCategorySchema = z.enum([
  "roads",
  "water",
  "security",
  "health",
  "electricity",
  "other",
]);
export type ReportCategory = z.infer<typeof reportCategorySchema>;

export const reportStatusSchema = z.enum([
  "submitted",
  "in_review",
  "resolved",
  "rejected",
]);
export type ReportStatus = z.infer<typeof reportStatusSchema>;

// Mirrors ReportPhotoSerializer.
export const reportPhotoSchema = z.object({
  id: z.number(),
  image: z.string(),
  created_at: z.string(),
});

// Mirrors ReportStatusUpdateSerializer.
export const reportStatusUpdateSchema = z.object({
  id: z.number(),
  old_status: reportStatusSchema,
  new_status: reportStatusSchema,
  note: z.string(),
  updated_by: z.number().nullable(),
  updated_by_name: z.string().nullable(),
  created_at: z.string(),
});

// Mirrors CitizenReportSerializer.
export const citizenReportSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: reportCategorySchema,
  ward: z.number().nullable(),
  ward_name: z.string().nullable(),
  status: reportStatusSchema,
  submitted_by: z.number().nullable(),
  submitted_by_name: z.string().nullable(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  photos: z.array(reportPhotoSchema),
  status_updates: z.array(reportStatusUpdateSchema),
  created_at: z.string(),
  updated_at: z.string(),
});

export type CitizenReport = z.infer<typeof citizenReportSchema>;
export const citizenReportListSchema = z.array(citizenReportSchema);
