import { requireSeller } from "@/lib/session";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  await requireSeller();
  return children;
}
