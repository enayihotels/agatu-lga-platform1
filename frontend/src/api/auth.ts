import { api } from "@/api/axios";
import { registerResponseSchema } from "@/schemas/register";
import { tokenPairSchema, userProfileSchema } from "@/schemas/user";

export interface RegisterInput {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  ward: number | null;
  password: string;
}

export async function register(input: RegisterInput) {
  const response = await api.post("/accounts/register/", input);
  return registerResponseSchema.parse(response.data);
}

export async function login(username: string, password: string) {
  const response = await api.post("/auth/token/", { username, password });
  return tokenPairSchema.parse(response.data);
}

export async function getMe() {
  const response = await api.get("/accounts/me/");
  return userProfileSchema.parse(response.data);
}
