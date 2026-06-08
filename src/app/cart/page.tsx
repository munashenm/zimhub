"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, parseImages } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    currency: string;
    images: unknown;
  };
}

export default function CartPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/cart");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/cart")
        .then((r) => r.json())
        .then(setItems)
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  const removeItem = async (productId: string) => {
    await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
    setItems(items.filter((i) => i.product.id !== productId));
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="container-app py-16 text-center text-gray-500">Loading cart...</div>
    );
  }

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-500">Your cart is empty</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={parseImages(item.product.images)[0] || "https://placehold.co/80x80"}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-medium text-gray-900 hover:text-brand-600"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-brand-700">
                    {formatPrice(item.product.price * item.quantity, item.product.currency)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="self-start rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 h-fit">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-brand-700">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="mt-6 block">
              <Button size="lg" className="w-full">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
