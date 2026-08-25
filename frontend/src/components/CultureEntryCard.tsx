import type { CultureEntry } from "@/schemas/history";

const categoryLabels: Record<CultureEntry["category"], string> = {
  language: "Language",
  festival: "Festival",
  proverb: "Proverb",
  folklore: "Folklore",
  custom: "Custom / Tradition",
};

export default function CultureEntryCard({ entry }: { entry: CultureEntry }) {
  return (
    <div className="overflow-hidden rounded-lg border border-agatu-earth-200 bg-white">
      {entry.image && (
        <img src={entry.image} alt="" className="h-40 w-full object-cover" />
      )}
      <div className="p-4">
        <span className="text-xs font-medium uppercase text-agatu-farm-600">
          {categoryLabels[entry.category]}
        </span>
        <h3 className="mt-1 font-semibold text-agatu-earth-900">{entry.title}</h3>
        {entry.local_text && (
          <p className="mt-1 italic text-agatu-river-700">{entry.local_text}</p>
        )}
        <p className="mt-1 text-sm text-agatu-earth-700">{entry.english_meaning}</p>
        {entry.context_notes && (
          <p className="mt-2 text-xs text-agatu-earth-500">{entry.context_notes}</p>
        )}
        {entry.audio_pronunciation && (
          <audio controls src={entry.audio_pronunciation} className="mt-2 w-full" />
        )}
      </div>
    </div>
  );
}
