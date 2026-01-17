/**
 * Role-based permissions and access control
 */

export type UserRole = "freelancer" | "client" | "admin";

export type Permission =
  // Job permissions
  | "jobs:browse"
  | "jobs:post"
  | "jobs:edit-own"
  | "jobs:delete-own"
  | "jobs:apply"
  // Freelancer permissions
  | "freelancers:browse"
  | "profile:edit-own"
  | "profile:view-earnings"
  // Proposal permissions
  | "proposals:create"
  | "proposals:view-own"
  // Contract permissions
  | "contracts:view-own"
  | "contracts:manage-own"
  // Admin permissions
  | "admin:access"
  | "admin:manage-users"
  | "admin:manage-jobs"
  | "admin:manage-contracts"
  | "admin:view-analytics";

/**
 * Role-based permissions mapping
 */
const rolePermissions: Record<UserRole, Permission[]> = {
  freelancer: [
    "jobs:browse",
    "jobs:apply",
    "proposals:create",
    "proposals:view-own",
    "contracts:view-own",
    "contracts:manage-own",
    "profile:edit-own",
    "profile:view-earnings",
  ],
  client: [
    "jobs:browse",
    "jobs:post",
    "jobs:edit-own",
    "jobs:delete-own",
    "freelancers:browse",
    "contracts:view-own",
    "contracts:manage-own",
    "profile:edit-own",
  ],
  admin: [
    "jobs:browse",
    "jobs:post",
    "jobs:edit-own",
    "jobs:delete-own",
    "jobs:apply",
    "freelancers:browse",
    "proposals:create",
    "proposals:view-own",
    "contracts:view-own",
    "contracts:manage-own",
    "profile:edit-own",
    "profile:view-earnings",
    "admin:access",
    "admin:manage-users",
    "admin:manage-jobs",
    "admin:manage-contracts",
    "admin:view-analytics",
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Route access control based on roles
 */
export interface RouteAccess {
  path: string;
  allowedRoles: UserRole[];
  requiredPermissions?: Permission[];
}

/**
 * Protected routes configuration
 */
export const protectedRoutes: RouteAccess[] = [
  // Job routes
  {
    path: "/my-jobs/post",
    allowedRoles: ["client", "admin"],
    requiredPermissions: ["jobs:post"],
  },
  {
    path: "/my-jobs",
    allowedRoles: ["client", "admin"],
    requiredPermissions: ["jobs:edit-own"],
  },
  {
    path: "/jobs",
    allowedRoles: ["freelancer", "client", "admin"],
    requiredPermissions: ["jobs:browse"],
  },
  // Freelancer routes
  {
    path: "/freelancers",
    allowedRoles: ["client", "admin"],
    requiredPermissions: ["freelancers:browse"],
  },
  // Proposal routes
  {
    path: "/proposals",
    allowedRoles: ["freelancer", "admin"],
    requiredPermissions: ["proposals:view-own"],
  },
  // Earnings routes
  {
    path: "/earnings",
    allowedRoles: ["freelancer", "admin"],
    requiredPermissions: ["profile:view-earnings"],
  },
  // Admin routes
  {
    path: "/admin",
    allowedRoles: ["admin"],
    requiredPermissions: ["admin:access"],
  },
  // Contract routes - accessible by both
  {
    path: "/contracts",
    allowedRoles: ["freelancer", "client", "admin"],
    requiredPermissions: ["contracts:view-own"],
  },
  // Messages - accessible by both
  {
    path: "/messages",
    allowedRoles: ["freelancer", "client", "admin"],
  },
  // Settings - accessible by all
  {
    path: "/settings",
    allowedRoles: ["freelancer", "client", "admin"],
  },
  // Profile edit - accessible by all
  {
    path: "/profile/edit",
    allowedRoles: ["freelancer", "client", "admin"],
    requiredPermissions: ["profile:edit-own"],
  },
];

/**
 * Check if a user can access a specific route
 */
export function canAccessRoute(
  role: UserRole,
  path: string
): boolean {
  const route = protectedRoutes.find((r) => path.startsWith(r.path));
  
  if (!route) {
    // If route is not in protected routes, allow access by default
    return true;
  }

  // Check if role is allowed
  if (!route.allowedRoles.includes(role)) {
    return false;
  }

  // Check required permissions if specified
  if (route.requiredPermissions) {
    return hasAllPermissions(role, route.requiredPermissions);
  }

  return true;
}

/**
 * Get accessible routes for a role
 */
export function getAccessibleRoutes(role: UserRole): string[] {
  return protectedRoutes
    .filter((route) => canAccessRoute(role, route.path))
    .map((route) => route.path);
}
