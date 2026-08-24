import { api } from "@/api/axios";
import { wardListSchema, wardSchema } from "@/schemas/ward";

export async function listWards() {
  const response = await api.get("/wards/");
  // DRF's default pagination wraps list responses in {count, next,
  // previous, results} -- unwrap before validating against the array
  // schema, following the same pattern established across the other
  // Agatu apps built on this backend.
  const results = response.data.results ?? response.data;
  return wardListSchema.parse(results);
}

export async function getWard(slug: string) {
  const response = await api.get(`/wards/${slug}/`);
  return wardSchema.parse(response.data);
}
