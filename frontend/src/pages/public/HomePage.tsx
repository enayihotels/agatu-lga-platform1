import { useQuery } from "@tanstack/react-query";

import { listNewsPosts } from "@/api/news";
import AlertBanner from "@/components/AlertBanner";
import AskWidget from "@/components/AskWidget";
import NewsFlashTicker from "@/components/NewsFlashTicker";
import NewsPostCard from "@/components/NewsPostCard";

export default function HomePage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["news-posts", "latest"],
    queryFn: () => listNewsPosts(),
  });

  const latestPosts = posts?.slice(0, 3) ?? [];

  return (
    <div>
      <NewsFlashTicker />
      <AlertBanner />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-agatu-earth-900">
          Welcome to AgatuConnect
        </h1>
        <p className="mt-2 text-agatu-earth-700">
          News, history, and culture from Agatu Local Government Area,
          Benue State.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="mb-3 font-semibold text-agatu-earth-900">
              Latest News
            </h2>
            {isLoading && (
              <p className="text-sm text-agatu-earth-500">Loading...</p>
            )}
            {!isLoading && latestPosts.length === 0 && (
              <p className="text-sm text-agatu-earth-500">
                No news posts published yet.
              </p>
            )}
            <div className="flex flex-col gap-3">
              {latestPosts.map((post) => (
                <NewsPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          <div>
            <AskWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
