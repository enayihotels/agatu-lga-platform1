import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicLayout from "@/components/PublicLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import LeaderEditorPage from "@/pages/admin/LeaderEditorPage";
import MediaUploadPage from "@/pages/admin/MediaUploadPage";
import NewsEditorPage from "@/pages/admin/NewsEditorPage";
import AlertsPage from "@/pages/public/AlertsPage";
import CulturePage from "@/pages/public/CulturePage";
import HistoryPage from "@/pages/public/HistoryPage";
import HomePage from "@/pages/public/HomePage";
import NewsPage from "@/pages/public/NewsPage";
import WardsPage from "@/pages/public/WardsPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/news", element: <NewsPage /> },
      { path: "/history", element: <HistoryPage /> },
      { path: "/culture", element: <CulturePage /> },
      { path: "/wards", element: <WardsPage /> },
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
      { path: "media", element: <MediaUploadPage /> },
    ],
  },
]);
