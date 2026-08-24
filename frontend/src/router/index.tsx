import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicLayout from "@/components/PublicLayout";
import LoginPage from "@/pages/LoginPage";
import AlertBroadcasterPage from "@/pages/admin/AlertBroadcasterPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import LeaderEditorPage from "@/pages/admin/LeaderEditorPage";
import MediaUploadPage from "@/pages/admin/MediaUploadPage";
import NewsEditorPage from "@/pages/admin/NewsEditorPage";
import ReportQueuePage from "@/pages/admin/ReportQueuePage";
import AlertsPage from "@/pages/public/AlertsPage";
import CulturePage from "@/pages/public/CulturePage";
import EventsPage from "@/pages/public/EventsPage";
import HistoryPage from "@/pages/public/HistoryPage";
import HomePage from "@/pages/public/HomePage";
import NewsPage from "@/pages/public/NewsPage";
import NewsPostDetailPage from "@/pages/public/NewsPostDetailPage";
import WardDetailPage from "@/pages/public/WardDetailPage";
import WardsPage from "@/pages/public/WardsPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/news", element: <NewsPage /> },
      { path: "/news/:slug", element: <NewsPostDetailPage /> },
      { path: "/history", element: <HistoryPage /> },
      { path: "/culture", element: <CulturePage /> },
      { path: "/wards", element: <WardsPage /> },
      { path: "/wards/:slug", element: <WardDetailPage /> },
      { path: "/events", element: <EventsPage /> },
      { path: "/alerts", element: <AlertsPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "news", element: <NewsEditorPage /> },
      { path: "history", element: <LeaderEditorPage /> },
      { path: "alerts", element: <AlertBroadcasterPage /> },
      { path: "reports", element: <ReportQueuePage /> },
      { path: "media", element: <MediaUploadPage /> },
    ],
  },
]);
