"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { PAYMENT_METHODS } from "@/lib/payments";

function CheckoutForm() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  const [form, setForm] = useState({
    shippingAddress: "",
    shippingCity: "",
    shippingPhone: "",
    notes: "",
    paymentMethod: "PAYNOW" as string,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
      return;
    }
    if (!productId && status === "authenticated") {
      fetch("/api/cart")
        .then((r) => r.json())
        .then((items) => {
          const total = items.reduce(
            (s: number, i: { product: { price: number }; quantity: number }) =>
              s + i.product.price * i.quantity,
            0
          );
          setCartTotal(total);
        });
    }
  }, [status, router, productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        ...(productId && { productId, quantity: 1 }),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Checkout failed");
      return;
    }

    if (data.payment?.redirectUrl) {
      router.push(data.payment.redirectUrl);
    } else {
      router.push(`/dashboard/orders/${data.order.id}?success=true`);
    }
  };

  if (status === "loading") {
    return <div className="container-app py-16 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Delivery Details</h2>
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
          <Input
            label="Delivery Address"
            name="shippingAddress"
            value={form.shippingAddress}
            onChange={handleChange}
            required
            placeholder="123 Samora Machel Ave, Avondale"
          />
          <Input
            label="City / Town"
            name="shippingCity"
            value={form.shippingCity}
            onChange={handleChange}
            required
            placeholder="Harare"
          />
          <Input
            label="Phone Number"
            name="shippingPhone"
            type="tel"
            value={form.shippingPhone}
            onChange={handleChange}
            required
            placeholder="+263 77 123 4567"
          />
          <Textarea
            label="Order Notes (optional)"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={2}
            placeholder="Delivery instructions..."
          />
        </div>

        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
            <div className="mt-4 space-y-3">
              {PAYMENT_METHODS.filter((m) => m.available).map((method) => (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                    form.paymentMethod === method.id
                      ? "border-brand-600 bg-brand-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={form.paymentMethod === method.id}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-medium text-gray-900">
                      {method.icon} {method.name}
                    </span>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>

            {!productId && cartTotal > 0 && (
              <div className="mt-6 flex justify-between border-t border-gray-100 pt-4">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold text-brand-700">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            )}

            <Button type="submit" size="lg" className="mt-6 w-full" loading={loading}>
              Place Order
            </Button>

            <p className="mt-3 text-center text-xs text-gray-400">
              Payment processing is in placeholder mode. Paynow/EcoCash integration coming soon.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutForm />
    </Suspense>
  );
}
