import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes: Record<string, string[]> = {
  "/admin": ["ADMIN"],
  "/seller": ["SELLER", "ADMIN"],
  "/dashboard": ["BUYER", "SELLER", "ADMIN"],
  "/cart": ["BUYER", "SELLER", "ADMIN"],
  "/checkout": ["BUYER", "SELLER", "ADMIN"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedRoute = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route)
  );

  if (!matchedRoute) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const allowedRoles = protectedRoutes[matchedRoute];
  if (!allowedRoles.includes(token.role as string)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/seller/:path*", "/dashboard/:path*", "/cart", "/checkout/:path*"],
};
