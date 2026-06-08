"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  Shield,
} from "lucide-react";

interface AdminData {
  stats: {
    pendingProducts: number;
    pendingSellers: number;
    totalOrders: number;
    totalUsers: number;
    totalCommissions: number;
  };
  recentOrders: {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    buyer: { name: string };
    items: { title: string }[];
  }[];
}

interface PendingProduct {
  id: string;
  title: string;
  price: number;
  status: string;
  seller: { name: string };
}

interface PendingSeller {
  id: string;
  businessName: string;
  location: string | null;
  verificationStatus: string;
  user: { name: string; email: string; phone: string | null };
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [pendingSellers, setPendingSellers] = useState<PendingSeller[]>([]);
  const [tab, setTab] = useState<"overview" | "products" | "sellers">("overview");

  const loadData = () => {
    fetch("/api/admin").then((r) => r.json()).then(setData);
    fetch("/api/products?status=PENDING_APPROVAL")
      .then((r) => r.json())
      .then((d) => setPendingProducts(d.products || []));
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/");
        return;
      }
      loadData();
      fetch("/api/admin/sellers")
        .then((r) => r.json())
        .then(setPendingSellers);
    }
  }, [status, session, router]);

  const approveProduct = async (id: string, approved: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: approved ? "APPROVED" : "REJECTED",
        rejectionReason: approved ? null : "Does not meet listing guidelines",
      }),
    });
    loadData();
  };

  const verifySeller = async (sellerProfileId: string, verified: boolean) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sellerProfileId,
        status: verified ? "VERIFIED" : "REJECTED",
      }),
    });
    loadData();
  };

  if (!data) {
    return <div className="container-app py-16 text-center text-gray-500">Loading...</div>;
  }

  const statCards = [
    { label: "Pending Products", value: data.stats.pendingProducts, icon: Package, color: "text-yellow-600" },
    { label: "Pending Sellers", value: data.stats.pendingSellers, icon: Shield, color: "text-orange-600" },
    { label: "Total Orders", value: data.stats.totalOrders, icon: ShoppingBag, color: "text-blue-600" },
    { label: "Total Users", value: data.stats.totalUsers, icon: Users, color: "text-purple-600" },
    { label: "Commissions Earned", value: formatPrice(data.stats.totalCommissions), icon: DollarSign, color: "text-brand-600" },
  ];

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "products" as const, label: `Products (${pendingProducts.length})` },
    { id: "sellers" as const, label: "Seller Verification" },
  ];

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-500">Manage ZimHub platform</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4">
            <s.icon className={`h-5 w-5 ${s.color}`} />
            <p className="mt-2 text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-2 border-b border-gray-200 pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium ${
              tab === t.id ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "overview" && (
          <div className="space-y-3">
            <h2 className="font-semibold">Recent Orders</h2>
            {data.recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
                <div>
                  <p className="font-medium">{o.orderNumber}</p>
                  <p className="text-sm text-gray-500">{o.buyer.name} · {o.items.map((i) => i.title).join(", ")}</p>
                </div>
                <div className="text-right">
                  <Badge variant="info">{ORDER_STATUS_LABELS[o.status]}</Badge>
                  <p className="mt-1 font-bold text-brand-700">{formatPrice(o.total)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "products" && (
          <div className="space-y-3">
            {pendingProducts.length === 0 ? (
              <p className="text-gray-500">No products pending approval.</p>
            ) : (
              pendingProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-gray-500">By {p.seller.name} · {formatPrice(p.price)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => approveProduct(p.id, true)}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => approveProduct(p.id, false)}>Reject</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "sellers" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Review and verify seller accounts to display trust badges on their listings.
            </p>
            {pendingSellers.length === 0 ? (
              <p className="text-gray-500">No sellers pending verification.</p>
            ) : (
              pendingSellers.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
                  <div>
                    <p className="font-medium">{s.businessName}</p>
                    <p className="text-sm text-gray-500">
                      {s.user.name} · {s.user.email}
                      {s.location && ` · ${s.location}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => verifySeller(s.id, true)}>Verify</Button>
                    <Button size="sm" variant="danger" onClick={() => verifySeller(s.id, false)}>Reject</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
