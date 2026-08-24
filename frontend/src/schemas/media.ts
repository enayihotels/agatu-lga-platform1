import { z } from "zod";

export const mediaAssetTypeSchema = z.enum(["image", "audio", "video", "document"]);
export type MediaAssetType = z.infer<typeof mediaAssetTypeSchema>;

// Mirrors MediaAssetSerializer.
export const mediaAssetSchema = z.object({
  id: z.number(),
  file: z.string(),
  thumbnail: z.string().nullable(),
  asset_type: mediaAssetTypeSchema,
  title: z.string(),
  alt_text: z.string(),
  caption: z.string(),
  uploaded_by: z.number().nullable(),
  uploaded_by_name: z.string().nullable(),
  file_size: z.number(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type MediaAsset = z.infer<typeof mediaAssetSchema>;
export const mediaAssetListSchema = z.array(mediaAssetSchema);
