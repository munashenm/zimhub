import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";
import { postLoginPath } from "./auth-redirect";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth(callbackUrl = "/dashboard") {
  const session = await getSession();
  if (!session?.user) {
    const params = new URLSearchParams();
    params.set("callbackUrl", callbackUrl);
    if (callbackUrl.startsWith("/seller") || callbackUrl.startsWith("/admin")) {
      params.set("role", "seller");
    }
    redirect(`/login?${params.toString()}`);
  }
  return session;
}

export async function requireRole(roles: string[], callbackUrl = "/dashboard") {
  const session = await requireAuth(callbackUrl);
  if (!roles.includes(session.user.role)) {
    redirect(postLoginPath(session.user.role));
  }
  return session;
}

export async function requireAdmin() {
  return requireRole(["ADMIN"], "/admin");
}

export async function requireSeller() {
  return requireRole(["SELLER", "ADMIN"], "/seller");
}

export async function requireBuyer() {
  return requireRole(["BUYER", "SELLER", "ADMIN"], "/dashboard");
}
