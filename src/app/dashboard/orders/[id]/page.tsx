"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle } from "lucide-react";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  commission: number;
  shippingAddress: string;
  shippingCity: string;
  shippingPhone: string;
  createdAt: string;
  items: { title: string; price: number; quantity: number }[];
}

function OrderDetailContent({ orderId }: { orderId: string }) {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/login");
    if (authStatus === "authenticated") {
      fetch(`/api/orders/${orderId}`)
        .then((r) => r.json())
        .then(setOrder);
    }
  }, [authStatus, router, orderId]);

  if (!order) {
    return <div className="container-app py-16 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="container-app py-8">
      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-800">
          <CheckCircle className="h-5 w-5" />
          Order placed successfully!
        </div>
      )}

      <Link href="/dashboard" className="text-sm text-brand-600 hover:text-brand-700">
        ← Back to Dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
        <Badge variant="info">{ORDER_STATUS_LABELS[order.status] || order.status}</Badge>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Items</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.title} × {item.quantity}</span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 font-bold">
            <span>Total</span>
            <span className="text-brand-700">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Delivery & Payment</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div><dt className="text-gray-500">Address</dt><dd>{order.shippingAddress}</dd></div>
            <div><dt className="text-gray-500">City</dt><dd>{order.shippingCity}</dd></div>
            <div><dt className="text-gray-500">Phone</dt><dd>{order.shippingPhone}</dd></div>
            <div><dt className="text-gray-500">Payment</dt><dd>{order.paymentMethod?.replace("_", " ")}</dd></div>
            <div><dt className="text-gray-500">Payment Status</dt><dd>{order.paymentStatus}</dd></div>
            <div><dt className="text-gray-500">Date</dt><dd>{new Date(order.createdAt).toLocaleString("en-ZW")}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}

function OrderDetailWrapper({ params }: { params: Promise<{ id: string }> }) {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setOrderId(p.id));
  }, [params]);

  if (!orderId) {
    return <div className="container-app py-16 text-center text-gray-500">Loading...</div>;
  }

  return <OrderDetailContent orderId={orderId} />;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense>
      <OrderDetailWrapper params={params} />
    </Suspense>
  );
}
