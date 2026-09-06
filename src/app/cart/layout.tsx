import { requireRole } from "@/lib/session";

export default async function CartLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["BUYER", "SELLER", "ADMIN"], "/cart");
  return children;
}
