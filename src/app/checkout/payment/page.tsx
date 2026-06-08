"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const provider = searchParams.get("provider");
  const orderId = searchParams.get("order");

  return (
    <div className="container-app flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle className="mx-auto h-16 w-16 text-brand-600" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Initiated</h1>
        <p className="mt-2 text-gray-600">
          Your {provider === "ecocash" ? "EcoCash" : "Paynow"} payment has been initiated.
        </p>
        {ref && (
          <p className="mt-2 text-sm text-gray-500">
            Reference: <span className="font-mono font-medium">{ref}</span>
          </p>
        )}
        <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
          This is a placeholder payment screen. In production, you would be redirected to
          Paynow or EcoCash to complete payment.
        </div>
        {orderId && (
          <Link href={`/dashboard/orders/${orderId}?success=true`} className="mt-6 inline-block">
            <Button className="w-full">View Order</Button>
          </Link>
        )}
        <Link href="/" className="mt-3 block text-sm text-brand-600 hover:text-brand-700">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentContent />
    </Suspense>
  );
}
