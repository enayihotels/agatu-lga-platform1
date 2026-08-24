import { api } from "@/api/axios";
import { tokenPairSchema, userProfileSchema } from "@/schemas/user";

export async function login(username: string, password: string) {
  const response = await api.post("/auth/token/", { username, password });
  return tokenPairSchema.parse(response.data);
}

export async function getMe() {
  const response = await api.get("/accounts/me/");
  return userProfileSchema.parse(response.data);
}
