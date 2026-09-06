import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { findSessionCookieName } from "@/lib/session-cookie";

const protectedRoutes: { prefix: string; roles: string[] }[] = [
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/seller", roles: ["SELLER", "ADMIN"] },
  { prefix: "/dashboard", roles: ["BUYER", "SELLER", "ADMIN"] },
  { prefix: "/cart", roles: ["BUYER", "SELLER", "ADMIN"] },
  { prefix: "/checkout", roles: ["BUYER", "SELLER", "ADMIN"] },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matched = protectedRoutes.find(
    (route) => pathname === route.prefix || pathname.startsWith(`${route.prefix}/`)
  );

  if (!matched) return NextResponse.next();

  // Never send people to /login from Edge. That is what bounced signed-in users
  // (header showed their name) back to the login form. Node layouts already
  // gate these routes with getServerSession, which matches the header session.
  const cookieName = findSessionCookieName(request.cookies, request.headers.get("cookie"));
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  void process.env.NEXTAUTH_URL;

  if (!cookieName || !secret) return NextResponse.next();

  try {
    const token = await getToken({
      req: request,
      secret,
      cookieName,
      secureCookie: cookieName.startsWith("__Secure-") || cookieName.startsWith("__Host-"),
    });
    if (token && !matched.roles.includes(token.role as string)) {
      if (token.role === "SELLER") {
        return NextResponse.redirect(new URL("/seller", request.url));
      }
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch {
    // Ignore decode failures; layouts still authenticate.
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/seller",
    "/seller/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/cart",
    "/cart/:path*",
    "/checkout",
    "/checkout/:path*",
  ],
};
