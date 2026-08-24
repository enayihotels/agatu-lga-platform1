import { useQuery } from "@tanstack/react-query";

import { listWards } from "@/api/wards";
import WardCard from "@/components/WardCard";

export default function WardsPage() {
  const { data: wards, isLoading } = useQuery({
    queryKey: ["wards"],
    queryFn: listWards,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold text-agatu-earth-900">Wards</h1>

      {isLoading && (
        <p className="mt-4 text-sm text-agatu-earth-500">Loading...</p>
      )}
      {!isLoading && (!wards || wards.length === 0) && (
        <p className="mt-4 text-sm text-agatu-earth-500">No wards found.</p>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {wards?.map((ward) => <WardCard key={ward.id} ward={ward} />)}
      </div>
    </div>
  );
}
