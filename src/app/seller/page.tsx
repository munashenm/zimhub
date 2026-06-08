"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUpload } from "@/components/products/ImageUpload";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { SellerBadge } from "@/components/ui/SellerBadge";
import {
  Package,
  Tag,
  DollarSign,
  Plus,
  Truck,
} from "lucide-react";

interface SellerData {
  profile: {
    businessName: string;
    verificationStatus: string;
    rating: number;
    reviewCount: number;
    totalSales: number;
    location: string | null;
  };
  products: {
    id: string;
    title: string;
    price: number;
    status: string;
    stock: number;
    category: { name: string };
  }[];
  offers: {
    id: string;
    amount: number;
    status: string;
    product: { title: string; price: number };
    buyer: { name: string };
  }[];
  orders: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    order: {
      id: string;
      orderNumber: string;
      status: string;
      buyer: { name: string };
    };
  }[];
  commissions: {
    id: string;
    saleAmount: number;
    commissionAmount: number;
    sellerPayout: number;
    order: { orderNumber: string; status: string };
  }[];
}

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<SellerData | null>(null);
  const [tab, setTab] = useState<"products" | "offers" | "orders" | "commissions" | "add">("products");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    condition: "New",
    stock: "1",
    images: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = () => {
    fetch("/api/seller").then((r) => r.json()).then(setData);
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      if (session?.user?.role !== "SELLER" && session?.user?.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
      loadData();
      fetch("/api/categories")
        .then((r) => r.json())
        .then((cats: { id: string; name: string }[]) => setCategories(cats));
    }
  }, [status, session, router]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        categoryId: form.categoryId,
        condition: form.condition,
        stock: parseInt(form.stock),
        images: form.images.split("\n").filter(Boolean),
      }),
    });

    const result = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("Product submitted for admin approval!");
      setForm({ title: "", description: "", price: "", categoryId: "", condition: "New", stock: "1", images: "" });
      setTab("products");
      loadData();
    } else {
      setMessage(result.error || "Failed to create product");
    }
  };

  const handleOfferAction = async (offerId: string, action: "ACCEPTED" | "REJECTED") => {
    await fetch("/api/seller", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offerId, action }),
    });
    loadData();
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    loadData();
  };

  if (!data) {
    return <div className="container-app py-16 text-center text-gray-500">Loading...</div>;
  }

  const tabs = [
    { id: "products" as const, label: "Products", icon: Package },
    { id: "offers" as const, label: "Offers", icon: Tag },
    { id: "orders" as const, label: "Orders", icon: Truck },
    { id: "commissions" as const, label: "Earnings", icon: DollarSign },
    { id: "add" as const, label: "Add Product", icon: Plus },
  ];

  return (
    <div className="container-app py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500">{data.profile.businessName}</p>
        </div>
        <SellerBadge
          status={data.profile.verificationStatus}
          rating={data.profile.rating}
          reviewCount={data.profile.reviewCount}
        />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-3">
        {[
          { label: "Total Sales", value: data.profile.totalSales },
          { label: "Products", value: data.products.length },
          { label: "Rating", value: data.profile.rating.toFixed(1) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-brand-700">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-gray-200 pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "products" && (
          <div className="space-y-3">
            {data.products.length === 0 ? (
              <p className="text-gray-500">No products yet. Add your first listing!</p>
            ) : (
              data.products.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-gray-500">{p.category.name} · {formatPrice(p.price)}</p>
                  </div>
                  <Badge variant={p.status === "APPROVED" ? "success" : p.status === "PENDING_APPROVAL" ? "warning" : "default"}>
                    {p.status.replace("_", " ")}
                  </Badge>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "offers" && (
          <div className="space-y-3">
            {data.offers.length === 0 ? (
              <p className="text-gray-500">No pending offers.</p>
            ) : (
              data.offers.map((o) => (
                <div key={o.id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="font-medium">{o.product.title}</p>
                  <p className="text-sm text-gray-500">
                    From {o.buyer.name}: {formatPrice(o.amount)} (listed at {formatPrice(o.product.price)})
                  </p>
                  {o.status === "PENDING" && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => handleOfferAction(o.id, "ACCEPTED")}>Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => handleOfferAction(o.id, "REJECTED")}>Reject</Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-3">
            {data.orders.length === 0 ? (
              <p className="text-gray-500">No orders yet.</p>
            ) : (
              data.orders.map((o) => (
                <div key={o.id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{o.order.orderNumber}</span>
                    <Badge variant="info">{ORDER_STATUS_LABELS[o.order.status]}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{o.title} × {o.quantity} — Buyer: {o.order.buyer.name}</p>
                  <div className="mt-3">
                    <Select
                      label="Update Delivery Status"
                      options={[
                        { value: "PROCESSING", label: "Processing" },
                        { value: "SHIPPED", label: "Shipped" },
                        { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
                        { value: "DELIVERED", label: "Delivered" },
                      ]}
                      onChange={(e) => updateOrderStatus(o.order.id, e.target.value)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "commissions" && (
          <div className="space-y-3">
            {data.commissions.length === 0 ? (
              <p className="text-gray-500">No earnings yet.</p>
            ) : (
              data.commissions.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
                  <div>
                    <p className="font-medium">{c.order.orderNumber}</p>
                    <p className="text-sm text-gray-500">
                      Sale: {formatPrice(c.saleAmount)} · Commission: {formatPrice(c.commissionAmount)}
                    </p>
                  </div>
                  <span className="font-bold text-brand-700">{formatPrice(c.sellerPayout)}</span>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "add" && (
          <form onSubmit={handleAddProduct} className="max-w-lg space-y-4">
            {message && (
              <div className="rounded-lg bg-brand-50 p-3 text-sm text-brand-800">{message}</div>
            )}
            <Input label="Product Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} />
            <Input label="Price (USD)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Select
              label="Category"
              options={[
                { value: "", label: "Select a category" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
            />
            <Select
              label="Condition"
              options={[
                { value: "New", label: "New" },
                { value: "Used - Like New", label: "Used - Like New" },
                { value: "Used - Good", label: "Used - Good" },
                { value: "Used - Fair", label: "Used - Fair" },
              ]}
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
            />
            <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <ImageUpload
              value={form.images}
              onChange={(images) => setForm({ ...form, images })}
            />
            <Button type="submit" loading={loading} disabled={!form.images.trim()}>Submit for Approval</Button>
          </form>
        )}
      </div>
    </div>
  );
}
