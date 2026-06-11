import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and public assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (token && authPaths.includes(pathname)) {
    const role = token.role as Role;
    const dashboardPath = roleDashboardMap[role] || "/login";
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // Public paths are accessible without authentication
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // If not authenticated and trying to access protected route
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  const userRole = token.role as Role;
  for (const [basePath, allowedRoles] of Object.entries(rolePathMap)) {
    if (pathname.startsWith(basePath)) {
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }
      break;
    }
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
