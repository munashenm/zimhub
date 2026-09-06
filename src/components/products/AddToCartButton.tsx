"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

interface AddToCartButtonProps {
  productId: string;
  className?: string;
}

export function AddToCartButton({ productId, className = "" }: AddToCartButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { refresh } = useCart();
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    setLoading(false);
    if (res.ok) {
      await refresh();
      router.push("/cart");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-500 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-500 hover:text-white disabled:opacity-50 ${className}`}
    >
      <ShoppingCart className="h-4 w-4" />
      {loading ? "Adding..." : "Add to cart"}
    </button>
  );
}
