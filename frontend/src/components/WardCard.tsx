import { Link } from "react-router-dom";

import type { WardListItem } from "@/schemas/ward";

export default function WardCard({ ward }: { ward: WardListItem }) {
  return (
    <Link
      to={`/wards/${ward.slug}`}
      className="block rounded-lg border border-agatu-earth-200 bg-white p-4 hover:border-agatu-river-300"
    >
      <h3 className="font-semibold text-agatu-earth-900">
        {ward.name}
        {ward.is_lga_headquarters && (
          <span className="ml-2 rounded-full bg-agatu-river-100 px-2 py-0.5 text-xs font-normal text-agatu-river-700">
            LGA HQ
          </span>
        )}
      </h3>
      {ward.headquarters_town && (
        <p className="mt-1 text-sm text-agatu-earth-600">{ward.headquarters_town}</p>
      )}
    </Link>
  );
}
