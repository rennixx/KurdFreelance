# Role-Based Access Control (RBAC) System

This document explains how to use the role-based permissions system in KurdFreelance.

## Overview

The system includes:
- **Permission-based access control**: Fine-grained control over specific actions
- **Role-based routing**: Automatic route protection based on user roles
- **UI components**: Show/hide elements based on permissions
- **Middleware protection**: Server-side route protection

## User Roles

- **Freelancer**: Can browse and apply to jobs, manage proposals, view earnings
- **Client**: Can post jobs, browse freelancers, manage job postings
- **Admin**: Has all permissions

## Using Permissions in Components

### 1. Using the `usePermissions` Hook

```tsx
import { usePermissions } from "@/hooks/use-permissions";

export function MyComponent() {
  const { hasPermission, isClient, isFreelancer } = usePermissions();

  return (
    <div>
      {hasPermission("jobs:post") && (
        <Button>Post a Job</Button>
      )}
      
      {isFreelancer && (
        <div>Freelancer-specific content</div>
      )}
    </div>
  );
}
```

### 2. Using the `PermissionGate` Component

```tsx
import { PermissionGate } from "@/components/auth";

export function MyComponent() {
  return (
    <div>
      <PermissionGate permission="jobs:post">
        <Button>Post a Job</Button>
      </PermissionGate>

      <PermissionGate role="client">
        <div>Only clients see this</div>
      </PermissionGate>

      <PermissionGate role={["client", "admin"]}>
        <div>Clients and admins see this</div>
      </PermissionGate>

      <PermissionGate 
        permission="admin:access"
        fallback={<div>Access denied</div>}
      >
        <AdminPanel />
      </PermissionGate>
    </div>
  );
}
```

### 3. Protecting Entire Pages

```tsx
import { ProtectedRoute } from "@/components/auth";

export default function PostJobPage() {
  return (
    <ProtectedRoute requiredPermission="jobs:post">
      <div>
        <h1>Post a Job</h1>
        {/* Your page content */}
      </div>
    </ProtectedRoute>
  );
}
```

## Available Permissions

### Job Permissions
- `jobs:browse` - Browse job listings
- `jobs:post` - Post new jobs
- `jobs:edit-own` - Edit own job postings
- `jobs:delete-own` - Delete own job postings
- `jobs:apply` - Apply to jobs

### Freelancer Permissions
- `freelancers:browse` - Browse freelancer profiles
- `profile:edit-own` - Edit own profile
- `profile:view-earnings` - View earnings dashboard

### Proposal Permissions
- `proposals:create` - Create job proposals
- `proposals:view-own` - View own proposals

### Contract Permissions
- `contracts:view-own` - View own contracts
- `contracts:manage-own` - Manage own contracts

### Admin Permissions
- `admin:access` - Access admin dashboard
- `admin:manage-users` - Manage users
- `admin:manage-jobs` - Manage all jobs
- `admin:manage-contracts` - Manage all contracts
- `admin:view-analytics` - View analytics

## Route Protection

Routes are automatically protected by middleware. If a user tries to access a route they don't have permission for, they'll be redirected to:
- `/login` - If not authenticated
- `/unauthorized` - If authenticated but lacking permission

### Role-Based Route Access

- `/my-jobs/*` - Only clients and admins
- `/proposals` - Only freelancers and admins
- `/earnings` - Only freelancers and admins
- `/freelancers` - Only clients and admins
- `/admin/*` - Only admins

## Checking Permissions Programmatically

```tsx
import { useAuthStore } from "@/stores";

export function MyComponent() {
  const { hasPermission, canAccessRoute, getUserRole } = useAuthStore();

  const role = getUserRole(); // Returns "freelancer" | "client" | "admin" | null
  const canPost = hasPermission("jobs:post");
  const canAccessAdmin = canAccessRoute("/admin");

  // ...
}
```

## Adding New Permissions

1. Add the permission to `src/lib/permissions.ts`:
```typescript
export type Permission =
  // ... existing permissions
  | "new:permission";
```

2. Add it to the appropriate role in `rolePermissions`:
```typescript
const rolePermissions: Record<UserRole, Permission[]> = {
  client: [
    // ... existing permissions
    "new:permission",
  ],
};
```

3. Use it in your components:
```tsx
<PermissionGate permission="new:permission">
  <NewFeature />
</PermissionGate>
```

## Best Practices

1. **Use middleware protection for sensitive routes** - Don't rely only on UI hiding
2. **Check permissions server-side** - Always verify permissions in API routes
3. **Provide feedback** - Show users why they can't access something
4. **Test different roles** - Test your features with different user roles
5. **Keep permissions granular** - Create specific permissions rather than broad ones
