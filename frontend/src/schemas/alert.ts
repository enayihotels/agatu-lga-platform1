import { z } from "zod";

export const alertSeveritySchema = z.enum(["info", "warning", "critical"]);
export type AlertSeverity = z.infer<typeof alertSeveritySchema>;

// Mirrors EmergencyAlertSerializer.
export const emergencyAlertSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  severity: alertSeveritySchema,
  ward: z.number().nullable(),
  ward_name: z.string().nullable(),
  send_sms: z.boolean(),
  sms_sent_at: z.string().nullable(),
  is_active: z.boolean(),
  created_by: z.number(),
  created_by_name: z.string().nullable(),
  recipient_count: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type EmergencyAlert = z.infer<typeof emergencyAlertSchema>;
export const emergencyAlertListSchema = z.array(emergencyAlertSchema);
