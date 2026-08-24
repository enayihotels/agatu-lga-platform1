import { api } from "@/api/axios";
import { wardDetailSchema, wardListSchema } from "@/schemas/ward";

export async function listWards() {
  const response = await api.get("/wards/");
  const results = response.data.results ?? response.data;
  return wardListSchema.parse(results);
}

export async function getWard(slug: string) {
  const response = await api.get(`/wards/${slug}/`);
  return wardDetailSchema.parse(response.data);
}
