import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { listNewsPosts } from "@/api/news";
import { createNewsFlash, createNewsPost } from "@/api/newsAdmin";
import { listWards } from "@/api/wards";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().max(300).optional().default(""),
  body: z.string().min(1, "Body is required"),
  ward: z.string().optional().default(""),
  is_published: z.boolean().default(false),
});
type PostFormValues = z.input<typeof postSchema>;

const flashSchema = z.object({
  headline: z.string().min(1, "Headline is required").max(150),
  priority: z.coerce.number().int().default(0),
});
type FlashFormValues = z.input<typeof flashSchema>;

export default function NewsEditorPage() {
  const queryClient = useQueryClient();

  const { data: posts } = useQuery({ queryKey: ["news-posts"], queryFn: () => listNewsPosts() });
  const { data: wards } = useQuery({ queryKey: ["wards"], queryFn: listWards });

  const postForm = useForm<PostFormValues>({ resolver: zodResolver(postSchema) });
  const flashForm = useForm<FlashFormValues>({ resolver: zodResolver(flashSchema) });

  const createPostMutation = useMutation({
    mutationFn: (values: PostFormValues) =>
      createNewsPost({
        title: values.title,
        excerpt: values.excerpt ?? "",
        body: values.body,
        category: null,
        ward: values.ward ? Number(values.ward) : null,
        is_published: values.is_published ?? false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-posts"] });
      postForm.reset();
    },
  });

  const createFlashMutation = useMutation({
    mutationFn: (values: FlashFormValues) =>
      createNewsFlash({
        headline: values.headline,
        priority: Number(values.priority),
        linked_post: null,
        expires_at: null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-flashes"] });
      flashForm.reset();
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-agatu-earth-900">News Editor</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold text-agatu-earth-800">New Post</h2>
          <form
            onSubmit={postForm.handleSubmit((values) => createPostMutation.mutate(values))}
            className="flex flex-col gap-3 rounded-lg border border-agatu-earth-200 bg-white p-4"
          >
            <input
              placeholder="Title"
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...postForm.register("title")}
            />
            {postForm.formState.errors.title && (
              <p className="text-xs text-agatu-alert-critical">
                {postForm.formState.errors.title.message}
              </p>
            )}

            <input
              placeholder="Excerpt (optional, short summary)"
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...postForm.register("excerpt")}
            />

            <textarea
              placeholder="Body"
              rows={6}
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...postForm.register("body")}
            />
            {postForm.formState.errors.body && (
              <p className="text-xs text-agatu-alert-critical">
                {postForm.formState.errors.body.message}
              </p>
            )}

            <select
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...postForm.register("ward")}
            >
              <option value="">No specific ward (LGA-wide)</option>
              {wards?.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.name}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...postForm.register("is_published")} />
              Publish immediately
            </label>

            <button
              type="submit"
              disabled={createPostMutation.isPending}
              className="rounded bg-agatu-river-600 px-4 py-2 text-sm font-medium text-white hover:bg-agatu-river-700 disabled:opacity-50"
            >
              {createPostMutation.isPending ? "Saving..." : "Save Post"}
            </button>
            {createPostMutation.isError && (
              <p className="text-xs text-agatu-alert-critical">
                Couldn&apos;t save the post. Check the fields and try again.
              </p>
            )}
          </form>

          <h2 className="mb-2 mt-8 font-semibold text-agatu-earth-800">Existing Posts</h2>
          <div className="flex flex-col gap-2">
            {posts?.length === 0 && (
              <p className="text-sm text-agatu-earth-500">No posts yet.</p>
            )}
            {posts?.map((post) => (
              <div
                key={post.id}
                className="rounded border border-agatu-earth-200 bg-white p-3 text-sm"
              >
                <span className="font-medium">{post.title}</span>
                {!post.published_at && (
                  <span className="ml-2 rounded-full bg-agatu-earth-100 px-2 py-0.5 text-xs text-agatu-earth-600">
                    Draft
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-semibold text-agatu-earth-800">
            News Flash (Ticker)
          </h2>
          <form
            onSubmit={flashForm.handleSubmit((values) => createFlashMutation.mutate(values))}
            className="flex flex-col gap-3 rounded-lg border border-agatu-earth-200 bg-white p-4"
          >
            <input
              placeholder="Headline (short, ticker-style)"
              maxLength={150}
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...flashForm.register("headline")}
            />
            {flashForm.formState.errors.headline && (
              <p className="text-xs text-agatu-alert-critical">
                {flashForm.formState.errors.headline.message}
              </p>
            )}

            <input
              type="number"
              placeholder="Priority (higher shows first)"
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...flashForm.register("priority")}
            />

            <button
              type="submit"
              disabled={createFlashMutation.isPending}
              className="rounded bg-agatu-farm-600 px-4 py-2 text-sm font-medium text-white hover:bg-agatu-farm-700 disabled:opacity-50"
            >
              {createFlashMutation.isPending ? "Adding..." : "Add to Ticker"}
            </button>
          </form>
          <p className="mt-2 text-xs text-agatu-earth-500">
            Note: flashes can currently only be deactivated by setting an
            expiry date in a future update -- the API doesn&apos;t yet expose
            an is_active toggle here.
          </p>
        </section>
      </div>
    </div>
  );
}
