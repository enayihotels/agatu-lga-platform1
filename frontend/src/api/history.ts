import { api } from "@/api/axios";
import {
  cultureEntryListSchema,
  historicalEventListSchema,
  leaderListSchema,
} from "@/schemas/history";

export async function listLeaders() {
  const response = await api.get("/history/leaders/");
  const results = response.data.results ?? response.data;
  return leaderListSchema.parse(results);
}

export async function listHistoricalEvents() {
  const response = await api.get("/history/events/");
  const results = response.data.results ?? response.data;
  return historicalEventListSchema.parse(results);
}

export async function listCultureEntries() {
  const response = await api.get("/history/culture/");
  const results = response.data.results ?? response.data;
  return cultureEntryListSchema.parse(results);
}
