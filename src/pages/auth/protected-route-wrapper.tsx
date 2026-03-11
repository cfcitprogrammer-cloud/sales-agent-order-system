import { useAuthStore } from "@/stores/auth-store";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[]; // e.g., ["admin", "manager"]
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading, role } = useAuthStore();

  if (loading) return <p>Loading...</p>;

  if (!user || !role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
