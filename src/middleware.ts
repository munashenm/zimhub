import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ensureAuthEnv, getAuthSecret } from "@/lib/auth-env";

ensureAuthEnv();

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

  const token = await getToken({
    req: request,
    secret: getAuthSecret(),
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    if (pathname.startsWith("/seller")) loginUrl.searchParams.set("role", "seller");
    if (pathname.startsWith("/admin")) loginUrl.searchParams.set("role", "seller");
    return NextResponse.redirect(loginUrl);
  }

  if (!matched.roles.includes(token.role as string)) {
    if (token.role === "SELLER") {
      return NextResponse.redirect(new URL("/seller", request.url));
    }
    if (token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
