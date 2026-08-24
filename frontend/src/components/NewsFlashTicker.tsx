import { useQuery } from "@tanstack/react-query";

import { listActiveNewsFlashes } from "@/api/news";

export default function NewsFlashTicker() {
  const { data: flashes } = useQuery({
    queryKey: ["news-flashes"],
    queryFn: listActiveNewsFlashes,
  });

  if (!flashes || flashes.length === 0) return null;

  return (
    <div className="overflow-hidden border-y border-agatu-river-200 bg-agatu-river-50 py-2">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4">
        <span className="shrink-0 rounded bg-agatu-river-600 px-2 py-0.5 text-xs font-semibold text-white">
          NEWS
        </span>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-agatu-river-800">
          {flashes.map((flash) => (
            <span key={flash.id}>{flash.headline}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
