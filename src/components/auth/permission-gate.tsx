"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { type Permission, type UserRole } from "@/lib/permissions";

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: Permission;
  role?: UserRole | UserRole[];
  fallback?: React.ReactNode;
}

/**
 * Component to conditionally render content based on permissions or roles
 * 
 * Usage:
 * <PermissionGate permission="jobs:post">
 *   <Button>Post a Job</Button>
 * </PermissionGate>
 * 
 * <PermissionGate role="client">
 *   <ClientOnlyContent />
 * </PermissionGate>
 * 
 * <PermissionGate role={["client", "admin"]}>
 *   <AdminOrClientContent />
 * </PermissionGate>
 */
export function PermissionGate({
  children,
  permission,
  role,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission, role: userRole } = usePermissions();

  // Check permission if specified
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check role if specified
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
