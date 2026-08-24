import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { listReportsForStaff } from "@/api/reportsAdmin";
import { listWards } from "@/api/wards";

export default function DashboardPage() {
  const { data: wards } = useQuery({ queryKey: ["wards"], queryFn: listWards });
  const { data: reports } = useQuery({
    queryKey: ["reports", "staff"],
    queryFn: listReportsForStaff,
  });

  const openReports = reports?.filter((r) => r.status === "submitted").length ?? 0;

  const tiles = [
    { to: "/admin/news", label: "News & Flashes", hint: "Publish news, manage the ticker" },
    { to: "/admin/history", label: "Leaders & History", hint: "Manage leader profiles" },
    { to: "/admin/alerts", label: "Emergency Alerts", hint: "Broadcast flood/security alerts" },
    {
      to: "/admin/reports",
      label: "Citizen Reports",
      hint: `${openReports} awaiting review`,
    },
    { to: "/admin/media", label: "Media Library", hint: "Upload and browse assets" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-agatu-earth-900">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-agatu-earth-600">
        {wards?.length ?? 0} wards configured.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tiles.map((tile) => (
          <Link
            key={tile.to}
            to={tile.to}
            className="rounded-lg border border-agatu-earth-200 bg-white p-4 hover:border-agatu-river-300"
          >
            <h2 className="font-semibold text-agatu-earth-900">{tile.label}</h2>
            <p className="mt-1 text-sm text-agatu-earth-600">{tile.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
