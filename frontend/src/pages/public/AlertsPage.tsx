import { useQuery } from "@tanstack/react-query";

import { listActiveAlerts } from "@/api/alerts";
import type { AlertSeverity } from "@/schemas/alert";

const severityStyles: Record<AlertSeverity, string> = {
  info: "border-agatu-alert-info text-agatu-alert-info",
  warning: "border-agatu-alert-warning text-agatu-alert-warning",
  critical: "border-agatu-alert-critical text-agatu-alert-critical",
};

export default function AlertsPage() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["active-alerts"],
    queryFn: listActiveAlerts,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold text-agatu-alert-critical">
        Emergency Alerts
      </h1>

      {isLoading && (
        <p className="mt-4 text-sm text-agatu-earth-500">Loading...</p>
      )}
      {!isLoading && (!alerts || alerts.length === 0) && (
        <p className="mt-4 text-sm text-agatu-earth-500">
          No active alerts right now.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {alerts?.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border-l-4 bg-white p-4 ${severityStyles[alert.severity]}`}
          >
            <span className="text-xs font-semibold uppercase">
              {alert.severity}
              {alert.ward_name ? ` · ${alert.ward_name}` : " · LGA-wide"}
            </span>
            <h3 className="mt-1 font-semibold text-agatu-earth-900">
              {alert.title}
            </h3>
            <p className="mt-1 text-sm text-agatu-earth-700">{alert.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
