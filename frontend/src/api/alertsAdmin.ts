import { api } from "@/api/axios";
import { emergencyAlertSchema, type AlertSeverity } from "@/schemas/alert";

export interface AlertInput {
  title: string;
  body: string;
  severity: AlertSeverity;
  ward: number | null;
  send_sms: boolean;
}

export async function createAlert(input: AlertInput) {
  const response = await api.post("/alerts/", input);
  return emergencyAlertSchema.parse(response.data);
}
