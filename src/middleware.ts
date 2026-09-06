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

function loginRedirect(request: NextRequest, pathname: string) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  if (pathname.startsWith("/seller") || pathname.startsWith("/admin")) {
    loginUrl.searchParams.set("role", "seller");
  }
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matched = protectedRoutes.find(
    (route) => pathname === route.prefix || pathname.startsWith(`${route.prefix}/`)
  );

  if (!matched) return NextResponse.next();

  const cookieName = findSessionCookieName(request.cookies);
  if (!cookieName) {
    return loginRedirect(request, pathname);
  }

  // These identifiers must appear in this file so Next.js inlines them for Edge.
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  void process.env.NEXTAUTH_URL;

  if (secret) {
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
      // Cookie is present. Node layouts still authenticate with getServerSession.
    }
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
