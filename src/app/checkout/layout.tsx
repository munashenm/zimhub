import { requireRole } from "@/lib/session";

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["BUYER", "SELLER", "ADMIN"], "/checkout");
  return children;
}
