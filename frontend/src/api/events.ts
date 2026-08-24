import { api } from "@/api/axios";
import { eventListSchema } from "@/schemas/event";

export async function listUpcomingEvents() {
  const response = await api.get("/events/");
  const results = response.data.results ?? response.data;
  return eventListSchema.parse(results);
}
