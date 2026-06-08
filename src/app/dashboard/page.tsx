"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Package, Tag } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { title: string; price: number; quantity: number }[];
}

interface Offer {
  id: string;
  amount: number;
  status: string;
  product: { title: string; slug: string; price: number };
}

export default function BuyerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      fetch("/api/orders").then((r) => r.json()).then(setOrders);
      fetch("/api/offers?type=sent").then((r) => r.json()).then(setOffers);
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="container-app py-16 text-center text-gray-500">Loading...</div>;
  }

  const statusVariant = (s: string) => {
    if (s === "DELIVERED") return "success" as const;
    if (s === "CANCELLED") return "danger" as const;
    if (s === "PENDING_PAYMENT") return "warning" as const;
    return "info" as const;
  };

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome, {session?.user?.name}
      </h1>
      <p className="text-gray-500">Manage your orders and offers</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-semibold">My Orders</h2>
          </div>
          {orders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
              No orders yet.{" "}
              <Link href="/" className="text-brand-600 hover:text-brand-700">Start shopping</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="block rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{order.orderNumber}</span>
                    <Badge variant={statusVariant(order.status)}>
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {order.items.map((i) => i.title).join(", ")}
                  </p>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-ZW")}
                    </span>
                    <span className="font-bold text-brand-700">{formatPrice(order.total)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <Tag className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-semibold">My Offers</h2>
          </div>
          {offers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
              No offers submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {offers.map((offer) => (
                <div key={offer.id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/product/${offer.product.slug}`}
                      className="font-medium text-gray-900 hover:text-brand-600"
                    >
                      {offer.product.title}
                    </Link>
                    <Badge variant={offer.status === "ACCEPTED" ? "success" : offer.status === "REJECTED" ? "danger" : "warning"}>
                      {offer.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-gray-500">
                      Listed: {formatPrice(offer.product.price)}
                    </span>
                    <span className="font-bold text-brand-700">
                      Offer: {formatPrice(offer.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
