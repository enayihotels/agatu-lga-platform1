import { api } from "@/api/axios";
import { askResponseSchema } from "@/schemas/ask";

export async function askAgatuConnect(question: string) {
  const response = await api.post("/ask/", { question });
  return askResponseSchema.parse(response.data);
}
