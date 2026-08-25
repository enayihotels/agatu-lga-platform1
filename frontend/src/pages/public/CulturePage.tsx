import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { listCultureEntries } from "@/api/history";
import childrenImage from "@/assets/hero/children.jpg";
import CultureEntryCard from "@/components/CultureEntryCard";
import type { CultureCategory } from "@/schemas/history";

const categories: { value: CultureCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "language", label: "Language" },
  { value: "festival", label: "Festival" },
  { value: "proverb", label: "Proverb" },
  { value: "folklore", label: "Folklore" },
  { value: "custom", label: "Custom / Tradition" },
];

export default function CulturePage() {
  const [filter, setFilter] = useState<CultureCategory | "all">("all");

  const { data: entries, isLoading } = useQuery({
    queryKey: ["culture-entries"],
    queryFn: listCultureEntries,
  });

  const filteredEntries =
    filter === "all" ? entries : entries?.filter((entry) => entry.category === filter);

  return (
    <div>
      <div className="relative h-56 w-full overflow-hidden bg-agatu-earth-900 sm:h-72">
        <img
          src={childrenImage}
          alt="Children of Agatu"
          className="h-full w-full object-cover object-top opacity-70"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-agatu-earth-900/30 px-4 text-center text-white">
          <h1 className="font-serif text-3xl font-extrabold sm:text-5xl">
            Culture &amp; Language
          </h1>
          <p className="mt-2 max-w-xl text-sm text-agatu-earth-100 sm:text-base">
            Part of the broader Idoma-related linguistic group, with a
            heritage of farming, fishing, and hunting along the Benue.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setFilter(category.value)}
              className={`rounded-full px-3 py-1 text-sm ${
                filter === category.value
                  ? "bg-agatu-farm-600 text-white"
                  : "bg-agatu-farm-50 text-agatu-farm-700"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <p className="mt-4 text-sm text-agatu-earth-500">Loading...</p>
        )}
        {!isLoading && (!filteredEntries || filteredEntries.length === 0) && (
          <p className="mt-4 text-sm text-agatu-earth-500">
            No culture entries published yet.
          </p>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {filteredEntries?.map((entry) => (
            <CultureEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}
