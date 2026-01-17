import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes - redirect to login if not authenticated
  const protectedRoutes = [
    "/dashboard",
    "/jobs",
    "/my-jobs",
    "/freelancers",
    "/proposals",
    "/contracts",
    "/messages",
    "/earnings",
    "/profile",
    "/settings",
    "/admin",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData) {
      const userRole = userData.role;
      const pathname = request.nextUrl.pathname;

      // Define role-based access rules
      const roleRestrictions: Record<string, string[]> = {
        "/my-jobs": ["client", "admin"],
        "/proposals": ["freelancer", "admin"],
        "/earnings": ["freelancer", "admin"],
        "/freelancers": ["client", "admin"],
        "/admin": ["admin"],
      };

      // Check if current route requires specific roles
      for (const [route, allowedRoles] of Object.entries(roleRestrictions)) {
        if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
          const url = request.nextUrl.clone();
          url.pathname = "/unauthorized";
          return NextResponse.redirect(url);
        }
      }
    }
  }

  // Auth routes - redirect to dashboard if already authenticated
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
