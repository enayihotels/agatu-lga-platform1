import { useQuery } from "@tanstack/react-query";

import { listNewsPosts } from "@/api/news";
import NewsPostCard from "@/components/NewsPostCard";

export default function NewsPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["news-posts"],
    queryFn: () => listNewsPosts(),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold text-agatu-earth-900">News</h1>

      {isLoading && (
        <p className="mt-4 text-sm text-agatu-earth-500">Loading...</p>
      )}
      {!isLoading && (!posts || posts.length === 0) && (
        <p className="mt-4 text-sm text-agatu-earth-500">
          No news posts published yet.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {posts?.map((post) => <NewsPostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}
