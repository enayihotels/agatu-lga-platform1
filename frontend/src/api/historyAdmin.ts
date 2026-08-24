import { api } from "@/api/axios";
import { leaderSchema } from "@/schemas/history";

export interface LeaderInput {
  full_name: string;
  title: string;
  start_year: number;
  end_year: number | null;
  biography: string;
  achievements: string;
  ward: number | null;
  is_current: boolean;
  portrait?: File | null;
}

function toFormData(input: LeaderInput): FormData {
  const formData = new FormData();
  formData.append("full_name", input.full_name);
  formData.append("title", input.title);
  formData.append("start_year", String(input.start_year));
  if (input.end_year !== null) formData.append("end_year", String(input.end_year));
  formData.append("biography", input.biography);
  formData.append("achievements", input.achievements);
  if (input.ward !== null) formData.append("ward", String(input.ward));
  formData.append("is_current", String(input.is_current));
  if (input.portrait) formData.append("portrait", input.portrait);
  return formData;
}

export async function createLeader(input: LeaderInput) {
  const response = await api.post("/history/leaders/", toFormData(input), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return leaderSchema.parse(response.data);
}

export async function updateLeader(id: number, input: LeaderInput) {
  const response = await api.patch(`/history/leaders/${id}/`, toFormData(input), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return leaderSchema.parse(response.data);
}
