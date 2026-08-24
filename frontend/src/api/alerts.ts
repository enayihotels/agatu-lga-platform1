import { api } from "@/api/axios";
import { emergencyAlertListSchema } from "@/schemas/alert";

export async function listActiveAlerts() {
  const response = await api.get("/alerts/");
  const results = response.data.results ?? response.data;
  return emergencyAlertListSchema.parse(results);
}
