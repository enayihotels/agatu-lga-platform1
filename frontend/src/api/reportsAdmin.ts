import { api } from "@/api/axios";
import { citizenReportListSchema, citizenReportSchema, type ReportStatus } from "@/schemas/report";

export async function listReportsForStaff() {
  const response = await api.get("/reports/");
  const results = response.data.results ?? response.data;
  return citizenReportListSchema.parse(results);
}

export async function updateReportStatus(id: number, status: ReportStatus, note = "") {
  const response = await api.post(`/reports/${id}/update_status/`, { status, note });
  return citizenReportSchema.parse(response.data);
}
