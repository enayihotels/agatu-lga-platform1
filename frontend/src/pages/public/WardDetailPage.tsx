import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getWard } from "@/api/wards";

export default function WardDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: ward, isLoading, isError } = useQuery({
    queryKey: ["ward", slug],
    queryFn: () => getWard(slug as string),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-agatu-earth-500">Loading...</p>
      </div>
    );
  }

  if (isError || !ward) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-agatu-alert-critical">
          This ward couldn&apos;t be found.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {ward.cover_image && (
        <img
          src={ward.cover_image}
          alt={ward.name}
          className="mb-4 w-full rounded-lg object-cover"
        />
      )}
      <h1 className="text-2xl font-bold text-agatu-earth-900">
        {ward.name}
        {ward.is_lga_headquarters && (
          <span className="ml-2 rounded-full bg-agatu-river-100 px-2 py-0.5 text-sm font-normal text-agatu-river-700">
            LGA HQ
          </span>
        )}
      </h1>
      {ward.headquarters_town && (
        <p className="mt-1 text-agatu-earth-600">{ward.headquarters_town}</p>
      )}
      {ward.description && (
        <p className="mt-4 text-agatu-earth-800">{ward.description}</p>
      )}

      {ward.clans.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 font-semibold text-agatu-earth-800">Clans</h2>
          <ul className="flex flex-col gap-1 text-sm text-agatu-earth-700">
            {ward.clans.map((clan) => (
              <li key={clan.id}>
                <span className="font-medium">{clan.name}</span>
                {clan.notes && ` — ${clan.notes}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {ward.contacts.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 font-semibold text-agatu-earth-800">Contacts</h2>
          <ul className="flex flex-col gap-2 text-sm text-agatu-earth-700">
            {ward.contacts.map((contact) => (
              <li key={contact.id}>
                <span className="font-medium">{contact.full_name}</span>
                {" — "}
                {contact.role_title}
                {contact.phone_number && ` · ${contact.phone_number}`}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
