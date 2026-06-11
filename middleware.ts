import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Role } from "@/types";

const publicPaths = ["/", "/about", "/contact", "/login", "/forgot-password"];
const authPaths = ["/login", "/forgot-password"];

const rolePathMap: Record<string, Role[]> = {
  "/super-admin": [Role.super_admin],
  "/admin": [Role.super_admin, Role.admin],
  "/dosen": [Role.dosen],
  "/mahasiswa": [Role.mahasiswa],
};

const roleDashboardMap: Record<Role, string> = {
  [Role.super_admin]: "/super-admin/dashboard",
  [Role.admin]: "/admin/dashboard",
  [Role.dosen]: "/dosen/dashboard",
  [Role.mahasiswa]: "/mahasiswa/dashboard",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role as Role | undefined;

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isLoggedIn && authPaths.includes(pathname)) {
    const dashboardPath = userRole ? roleDashboardMap[userRole] : "/login";
    return NextResponse.redirect(new URL(dashboardPath || "/login", req.url));
  }

  // Public paths are accessible without authentication
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // If not authenticated and trying to access protected route
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  if (userRole) {
    for (const [basePath, allowedRoles] of Object.entries(rolePathMap)) {
      if (pathname.startsWith(basePath)) {
        if (!allowedRoles.includes(userRole)) {
          return NextResponse.redirect(new URL("/access-denied", req.url));
        }
        break;
      }
    }
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
