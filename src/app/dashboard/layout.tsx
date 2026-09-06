import { requireBuyer } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireBuyer();
  return children;
}
