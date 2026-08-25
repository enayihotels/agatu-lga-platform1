import { useQuery } from "@tanstack/react-query";

import { listWards } from "@/api/wards";
import mapImage from "@/assets/hero/map.webp";
import WardCard from "@/components/WardCard";

export default function WardsPage() {
  const { data: wards, isLoading } = useQuery({
    queryKey: ["wards"],
    queryFn: listWards,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-serif text-3xl font-extrabold text-agatu-earth-900">
        The 10 Wards of Agatu
      </h1>
      <p className="mt-2 max-w-2xl text-agatu-earth-700">
        Agatu Local Government Area is divided into 10 administrative
        council wards, governing its major towns, villages, and vast,
        resource-rich agricultural lands along the Benue River.
      </p>

      <img
        src={mapImage}
        alt="Map of Agatu's 10 wards"
        className="animate-fade-up mt-6 w-full rounded-lg border border-agatu-earth-200 object-cover"
      />

      <div className="animate-fade-up mt-8 rounded-lg border border-agatu-earth-200 bg-white p-6">
        <h2 className="mb-2 font-semibold text-agatu-earth-800">
          The Food Basket Along the River
        </h2>
        <p className="text-sm text-agatu-earth-700">
          Agatu sits directly along the Benue River trough, giving it one
          of the longest river system stretches in the state &mdash;
          responsible for over 80% of all fish production across Benue
          State&apos;s Zone C. The seasonal flooding deposits rich
          nutrients across low-lying Fadama land, supporting massive
          commercial yields of yams, cassava, rice, maize, soybeans,
          beniseed, and melon seeds.
        </p>
      </div>

      <h2 className="mb-3 mt-10 font-semibold text-agatu-earth-800">
        Browse the Wards
      </h2>
      {isLoading && (
        <p className="text-sm text-agatu-earth-500">Loading...</p>
      )}
      {!isLoading && (!wards || wards.length === 0) && (
        <p className="text-sm text-agatu-earth-500">No wards found.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {wards?.map((ward) => <WardCard key={ward.id} ward={ward} />)}
      </div>
    </div>
  );
}
