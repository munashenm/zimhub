import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireRole(roles: string[]) {
  const session = await requireAuth();
  if (!roles.includes(session.user.role)) {
    redirect("/");
  }
  return session;
}

export async function requireAdmin() {
  return requireRole(["ADMIN"]);
}

export async function requireSeller() {
  return requireRole(["SELLER", "ADMIN"]);
}

export async function requireBuyer() {
  return requireRole(["BUYER", "SELLER", "ADMIN"]);
}
