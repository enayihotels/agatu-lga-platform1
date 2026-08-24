import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { listActiveAlerts } from "@/api/alerts";
import type { AlertSeverity } from "@/schemas/alert";

const severityStyles: Record<AlertSeverity, string> = {
  info: "bg-agatu-alert-info/10 border-agatu-alert-info text-agatu-alert-info",
  warning: "bg-agatu-alert-warning/10 border-agatu-alert-warning text-agatu-alert-warning",
  critical: "bg-agatu-alert-critical/10 border-agatu-alert-critical text-agatu-alert-critical",
};

export default function AlertBanner() {
  const { data: alerts } = useQuery({
    queryKey: ["active-alerts"],
    queryFn: listActiveAlerts,
  });

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 pt-4">
      {alerts.map((alert) => (
        <Link
          key={alert.id}
          to="/alerts"
          className={`mb-2 block rounded border-l-4 p-3 text-sm ${severityStyles[alert.severity]}`}
        >
          <span className="font-semibold uppercase">{alert.severity}</span>
          {" — "}
          <span className="font-medium">{alert.title}</span>
        </Link>
      ))}
    </div>
  );
}
