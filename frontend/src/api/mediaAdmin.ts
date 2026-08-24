import { api } from "@/api/axios";
import { mediaAssetListSchema, mediaAssetSchema } from "@/schemas/media";

export async function listMediaAssets() {
  const response = await api.get("/media/");
  const results = response.data.results ?? response.data;
  return mediaAssetListSchema.parse(results);
}

export async function uploadMediaAsset(file: File, title = "", altText = "") {
  const formData = new FormData();
  formData.append("file", file);
  if (title) formData.append("title", title);
  if (altText) formData.append("alt_text", altText);

  const response = await api.post("/media/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return mediaAssetSchema.parse(response.data);
}
