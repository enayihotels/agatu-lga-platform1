import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { listActiveAlerts } from "@/api/alerts";
import { createAlert } from "@/api/alertsAdmin";
import { listWards } from "@/api/wards";
import { alertSeveritySchema } from "@/schemas/alert";

const alertFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  severity: alertSeveritySchema,
  ward: z.string().optional().default(""),
  send_sms: z.boolean().default(false),
});
type AlertFormValues = z.input<typeof alertFormSchema>;

export default function AlertBroadcasterPage() {
  const queryClient = useQueryClient();

  const { data: alerts } = useQuery({
    queryKey: ["active-alerts"],
    queryFn: listActiveAlerts,
  });
  const { data: wards } = useQuery({ queryKey: ["wards"], queryFn: listWards });

  const { register, handleSubmit, reset, formState } = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: { severity: "warning" },
  });

  const createMutation = useMutation({
    mutationFn: (values: AlertFormValues) =>
      createAlert({
        title: values.title,
        body: values.body,
        severity: values.severity,
        ward: values.ward ? Number(values.ward) : null,
        send_sms: values.send_sms ?? false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-alerts"] });
      reset({ severity: "warning" });
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-agatu-earth-900">
        Emergency Alerts
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold text-agatu-earth-800">
            Broadcast a New Alert
          </h2>
          <form
            onSubmit={handleSubmit((values) => createMutation.mutate(values))}
            className="flex flex-col gap-3 rounded-lg border border-agatu-earth-200 bg-white p-4"
          >
            <input
              placeholder="Title"
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...register("title")}
            />
            {formState.errors.title && (
              <p className="text-xs text-agatu-alert-critical">
                {formState.errors.title.message}
              </p>
            )}

            <textarea
              placeholder="Details -- what's happening, what residents should do"
              rows={4}
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...register("body")}
            />
            {formState.errors.body && (
              <p className="text-xs text-agatu-alert-critical">
                {formState.errors.body.message}
              </p>
            )}

            <select
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...register("severity")}
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>

            <select
              className="rounded border border-agatu-earth-200 px-3 py-2 text-sm"
              {...register("ward")}
            >
              <option value="">LGA-wide (all wards)</option>
              {wards?.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.name}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("send_sms")} />
              Send SMS to affected residents
            </label>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded bg-agatu-alert-critical px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {createMutation.isPending ? "Broadcasting..." : "Broadcast Alert"}
            </button>
            {createMutation.isError && (
              <p className="text-xs text-agatu-alert-critical">
                Couldn&apos;t create the alert. Check the fields and try again.
              </p>
            )}
          </form>
        </section>

        <section>
          <h2 className="mb-3 font-semibold text-agatu-earth-800">
            Active Alerts
          </h2>
          <div className="flex flex-col gap-3">
            {alerts?.length === 0 && (
              <p className="text-sm text-agatu-earth-500">No active alerts.</p>
            )}
            {alerts?.map((alert) => (
              <div
                key={alert.id}
                className="rounded border border-agatu-earth-200 bg-white p-3 text-sm"
              >
                <span className="font-semibold uppercase text-agatu-alert-critical">
                  {alert.severity}
                </span>
                <span className="ml-2 font-medium">{alert.title}</span>
                <p className="mt-1 text-xs text-agatu-earth-500">
                  {alert.ward_name ?? "LGA-wide"} · {alert.recipient_count}{" "}
                  notified
                  {alert.sms_sent_at && " · SMS sent"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
