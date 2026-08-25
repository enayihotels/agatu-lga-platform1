import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";

const STAFF_ROLES = new Set(["super_admin", "content_editor", "ward_officer"]);

interface ProtectedRouteProps {
  children: ReactNode;
  /**
   * When true, also requires the logged-in user to hold a staff role
   * (super_admin/content_editor/ward_officer) -- used for /admin/*
   * routes so a regular resident account can't land in the CMS.
   */
  staffOnly?: boolean;
}

export default function ProtectedRoute({ children, staffOnly = false }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (staffOnly && (!user || !STAFF_ROLES.has(user.role))) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
}
