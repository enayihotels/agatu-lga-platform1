import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { listReportsForStaff, updateReportStatus } from "@/api/reportsAdmin";
import type { ReportStatus } from "@/schemas/report";

const statusOptions: ReportStatus[] = ["submitted", "in_review", "resolved", "rejected"];

const statusLabels: Record<ReportStatus, string> = {
  submitted: "Submitted",
  in_review: "In Review",
  resolved: "Resolved",
  rejected: "Rejected",
};

export default function ReportQueuePage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");

  const { data: reports, isLoading } = useQuery({
    queryKey: ["reports", "staff"],
    queryFn: listReportsForStaff,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ReportStatus }) =>
      updateReportStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", "staff"] });
    },
  });

  const filteredReports =
    statusFilter === "all" ? reports : reports?.filter((r) => r.status === statusFilter);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-agatu-earth-900">
        Citizen Report Queue
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["all", ...statusOptions] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-3 py-1 text-sm ${
              statusFilter === status
                ? "bg-agatu-river-600 text-white"
                : "bg-agatu-river-50 text-agatu-river-700"
            }`}
          >
            {status === "all" ? "All" : statusLabels[status]}
          </button>
        ))}
      </div>

      {isLoading && (
        <p className="mt-4 text-sm text-agatu-earth-500">Loading...</p>
      )}
      {!isLoading && (!filteredReports || filteredReports.length === 0) && (
        <p className="mt-4 text-sm text-agatu-earth-500">
          No reports in this category.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {filteredReports?.map((report) => (
          <div
            key={report.id}
            className="rounded-lg border border-agatu-earth-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-medium uppercase text-agatu-river-600">
                  {report.category}
                  {report.ward_name && ` · ${report.ward_name}`}
                </span>
                <h3 className="font-semibold text-agatu-earth-900">
                  {report.title}
                </h3>
                <p className="mt-1 text-sm text-agatu-earth-700">
                  {report.description}
                </p>
                {report.submitted_by_name && (
                  <p className="mt-1 text-xs text-agatu-earth-500">
                    Submitted by {report.submitted_by_name}
                  </p>
                )}
              </div>

              <select
                value={report.status}
                onChange={(event) =>
                  updateMutation.mutate({
                    id: report.id,
                    status: event.target.value as ReportStatus,
                  })
                }
                disabled={updateMutation.isPending}
                className="shrink-0 rounded border border-agatu-earth-200 px-2 py-1 text-sm"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </div>

            {report.photos.length > 0 && (
              <div className="mt-3 flex gap-2">
                {report.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.image}
                    alt=""
                    className="h-16 w-16 rounded object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
