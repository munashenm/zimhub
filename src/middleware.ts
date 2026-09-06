import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { canonicalZimhubHost } from "@/lib/auth-env";
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

  // These identifiers must appear in this file so Next.js inlines them for Edge.
  const canonicalUrl = process.env.NEXTAUTH_URL || process.env.AUTH_URL || "";
  void process.env.NEXTAUTH_SECRET;
  void process.env.AUTH_SECRET;

  const wantHost = canonicalZimhubHost(request.headers.get("host") || "", canonicalUrl);
  if (wantHost) {
    const url = request.nextUrl.clone();
    url.hostname = wantHost;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  const matched = protectedRoutes.find(
    (route) => pathname === route.prefix || pathname.startsWith(`${route.prefix}/`)
  );

  if (!matched) return NextResponse.next();

  // Never send people to /login from Edge. Node layouts already gate these
  // routes with getServerSession, which matches the header session.
  const cookieName = findSessionCookieName(request.cookies, request.headers.get("cookie"));
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
