import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getNewsPost } from "@/api/news";

export default function NewsPostDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["news-post", slug],
    queryFn: () => getNewsPost(slug as string),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-agatu-earth-500">Loading...</p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-agatu-alert-critical">
          This news post couldn&apos;t be found.
        </p>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          className="mb-4 w-full rounded-lg object-cover"
        />
      )}
      <h1 className="text-2xl font-bold text-agatu-earth-900">{post.title}</h1>
      {post.published_at && (
        <p className="mt-1 text-sm text-agatu-earth-500">
          {new Date(post.published_at).toLocaleDateString()}
        </p>
      )}
      <div className="mt-6 whitespace-pre-wrap leading-relaxed text-agatu-earth-800">
        {post.body}
      </div>
    </article>
  );
}
