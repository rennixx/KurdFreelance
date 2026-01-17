"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { type Permission } from "@/lib/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  fallbackUrl?: string;
}

/**
 * Component to protect routes based on permissions
 * Usage:
 * <ProtectedRoute requiredPermission="jobs:post">
 *   <PostJobPage />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  requiredPermission,
  fallbackUrl = "/dashboard",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, hasPermission, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push(fallbackUrl);
    }
  }, [isAuthenticated, hasPermission, requiredPermission, fallbackUrl, router, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  return <>{children}</>;
}
