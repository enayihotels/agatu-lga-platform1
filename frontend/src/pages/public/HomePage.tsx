import { useQuery } from "@tanstack/react-query";

import { listNewsPosts } from "@/api/news";
import AlertBanner from "@/components/AlertBanner";
import AskWidget from "@/components/AskWidget";
import Hero from "@/components/Hero";
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
      <Hero />
      <NewsFlashTicker />
      <AlertBanner />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="animate-fade-up md:col-span-2">
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

          <div className="animate-fade-up">
            <AskWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
