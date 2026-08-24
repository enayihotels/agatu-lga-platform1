import type { Leader } from "@/schemas/history";

export default function LeaderCard({ leader }: { leader: Leader }) {
  const years = `${leader.start_year}–${leader.end_year ?? "present"}`;

  return (
    <div className="flex gap-4 rounded-lg border border-agatu-earth-200 bg-white p-4">
      {leader.portrait ? (
        <img
          src={leader.portrait}
          alt={leader.full_name}
          className="h-20 w-20 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-agatu-earth-100 text-2xl font-bold text-agatu-earth-400">
          {leader.full_name.charAt(0)}
        </div>
      )}
      <div>
        <h3 className="font-semibold text-agatu-earth-900">{leader.full_name}</h3>
        <p className="text-sm text-agatu-river-600">
          {leader.title} · {years}
          {leader.is_current && (
            <span className="ml-2 rounded-full bg-agatu-farm-100 px-2 py-0.5 text-xs text-agatu-farm-700">
              Current
            </span>
          )}
        </p>
        {leader.ward_name && (
          <p className="text-xs text-agatu-earth-500">{leader.ward_name}</p>
        )}
        <p className="mt-2 text-sm text-agatu-earth-700">{leader.biography}</p>
      </div>
    </div>
  );
}
