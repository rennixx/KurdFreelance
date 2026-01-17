"use client";

import { useAuthStore } from "@/stores";
import { type Permission, type UserRole } from "@/lib/permissions";

/**
 * Hook for checking permissions in components
 */
export function usePermissions() {
  const { getUserRole, hasPermission: checkPermission, canAccessRoute: checkRoute } = useAuthStore();

  const role = getUserRole();

  return {
    role,
    hasPermission: (permission: Permission) => checkPermission(permission),
    canAccessRoute: (path: string) => checkRoute(path),
    isFreelancer: role === "freelancer",
    isClient: role === "client",
    isAdmin: role === "admin",
  };
}
