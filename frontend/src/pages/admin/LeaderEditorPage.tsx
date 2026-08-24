import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { listLeaders } from "@/api/history";
import { createLeader } from "@/api/historyAdmin";
import { listWards } from "@/api/wards";
import LeaderCard from "@/components/LeaderCard";

const leaderFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  title: z.string().min(1, "Title is required"),
  start_year: z.coerce.number().int().min(1900).max(2100),
  end_year: z.string().optional().default(""),
  biography: z.string().min(1, "Biography is required"),
  achievements: z.string().optional().default(""),
  ward: z.string().optional().default(""),
  is_current: z.boolean().default(false),
});
type LeaderFormValues = z.input<typeof leaderFormSchema>;

export default function LeaderEditorPage() {
  const queryClient = useQueryClient();
  const [portraitFile, setPortraitFile] = useState<File | null>(null);
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);

  const { data: leaders } = useQuery({ queryKey: ["leaders"], queryFn: listLeaders });
  const { data: wards } = useQuery({ queryKey: ["wards"], queryFn: listWards });

  const { register, handleSubmit, reset, formState } = useForm<LeaderFormValues>({
    resolver: zodResolver(leaderFormSchema),
  });

  const createMutation = useMutation({
    mutationFn: (values: LeaderFormValues) =>
      createLeader({
        full_name: values.full_name,
        title: values.title,
        start_year: Number(values.start_year),
        end_year: values.end_year ? Number(values.end_year) : null,
        biography: values.biography,
        achievements: values.achievements ?? "",
        ward: values.ward ? Number(values.ward) : null,
        is_current: values.is_current ?? false,
        portrait: portraitFile,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaders"] });
      reset();
      setPortraitFile(null);
      setPortraitPreview(null);
    },
  });

  function handlePortraitChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setPortraitFile(file);
    setPortraitPreview(file ? URL.createObjectURL(file) : null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-agatu-earth-900">
        Leader / History Editor
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold text-agatu-earth-800">
            Add a Leader
          </h2>
          <form
            onSubmit={handleSubmit((values) => createMutation.mutate(values))}
            className="flex flex-col gap-3 rounded-lg border border-agatu-earth-200 bg-white p-4"
          >
            <div>
              <label htmlFor="portrait" className="mb-1 block text-sm font-medium">
                Portrait
              </label>
              {portraitPreview && (
                <img
                  src={portraitPreview}
                  alt="Preview"
                  className="mb-2 h-24 w-24 rounded-full object-cover"
                />
              )}
              <input
                id="portrait"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePortraitChange}
                className="text-sm"
              />
            </div>

            <input
              placeholder="Full name"
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...register("full_name")}
            />
            {formState.errors.full_name && (
              <p className="text-xs text-agatu-alert-critical">
                {formState.errors.full_name.message}
              </p>
            )}

            <input
              placeholder="Title (e.g. Council Chairman)"
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...register("title")}
            />
            {formState.errors.title && (
              <p className="text-xs text-agatu-alert-critical">
                {formState.errors.title.message}
              </p>
            )}

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Start year"
                className="w-1/2 rounded border border-agatu-earth-200 px-3 py-2 text-sm"
                {...register("start_year")}
              />
              <input
                type="number"
                placeholder="End year (leave blank if current)"
                className="w-1/2 rounded border border-agatu-earth-200 px-3 py-2 text-sm"
                {...register("end_year")}
              />
            </div>
            {formState.errors.start_year && (
              <p className="text-xs text-agatu-alert-critical">
                {formState.errors.start_year.message}
              </p>
            )}

            <textarea
              placeholder="Biography"
              rows={4}
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...register("biography")}
            />
            {formState.errors.biography && (
              <p className="text-xs text-agatu-alert-critical">
                {formState.errors.biography.message}
              </p>
            )}

            <textarea
              placeholder="Achievements (optional)"
              rows={2}
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...register("achievements")}
            />

            <select
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...register("ward")}
            >
              <option value="">No specific ward</option>
              {wards?.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.name}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("is_current")} />
              Currently in office
            </label>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded bg-agatu-river-600 px-4 py-2 text-sm font-medium text-white hover:bg-agatu-river-700 disabled:opacity-50"
            >
              {createMutation.isPending ? "Saving..." : "Save Leader"}
            </button>
            {createMutation.isError && (
              <p className="text-xs text-agatu-alert-critical">
                Couldn&apos;t save. Check the fields and try again.
              </p>
            )}
          </form>
        </section>

        <section>
          <h2 className="mb-3 font-semibold text-agatu-earth-800">
            Existing Leaders
          </h2>
          <div className="flex flex-col gap-3">
            {leaders?.length === 0 && (
              <p className="text-sm text-agatu-earth-500">No leaders yet.</p>
            )}
            {leaders?.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
