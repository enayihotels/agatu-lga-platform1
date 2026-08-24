import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { listMediaAssets, uploadMediaAsset } from "@/api/mediaAdmin";

export default function MediaUploadPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { data: assets, isLoading } = useQuery({
    queryKey: ["media-assets"],
    queryFn: listMediaAssets,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadMediaAsset(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-assets"] });
    },
  });

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => uploadMutation.mutate(file));
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-agatu-earth-900">Media Library</h1>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center ${
          isDragging
            ? "border-agatu-river-500 bg-agatu-river-50"
            : "border-agatu-earth-200 bg-white"
        }`}
      >
        <p className="text-sm text-agatu-earth-700">
          Drag &amp; drop images here, or click to browse
        </p>
        <p className="mt-1 text-xs text-agatu-earth-500">
          JPG, PNG, WEBP, MP3, WAV, MP4, PDF -- up to 10MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {uploadMutation.isPending && (
        <p className="mt-2 text-sm text-agatu-river-600">Uploading...</p>
      )}
      {uploadMutation.isError && (
        <p className="mt-2 text-sm text-agatu-alert-critical">
          Upload failed -- check the file type and size, then try again.
        </p>
      )}

      {isLoading && (
        <p className="mt-6 text-sm text-agatu-earth-500">Loading...</p>
      )}
      {!isLoading && assets?.length === 0 && (
        <p className="mt-6 text-sm text-agatu-earth-500">
          No media uploaded yet.
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {assets?.map((asset) => (
          <div
            key={asset.id}
            className="overflow-hidden rounded-lg border border-agatu-earth-200 bg-white"
          >
            {asset.asset_type === "image" && asset.thumbnail ? (
              <img
                src={asset.thumbnail}
                alt={asset.alt_text || asset.title}
                className="h-32 w-full object-cover"
              />
            ) : (
              <div className="flex h-32 w-full items-center justify-center bg-agatu-earth-100 text-xs uppercase text-agatu-earth-500">
                {asset.asset_type}
              </div>
            )}
            <p className="truncate p-2 text-xs text-agatu-earth-700">
              {asset.title || "Untitled"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
