"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface AddToCartButtonProps {
  productId: string;
  className?: string;
}

export function AddToCartButton({ productId, className = "" }: AddToCartButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) {
        toast("Could not add to cart. Try again.", "error");
        return;
      }
      setAdded(true);
      toast("Added to cart");
      window.setTimeout(() => setAdded(false), 1800);
    } catch {
      toast("Could not add to cart. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-500 py-2 text-sm font-semibold text-brand-600 transition-all duration-200 hover:bg-brand-500 hover:text-white active:scale-[0.98] disabled:opacity-50 ${
        added ? "border-brand-600 bg-brand-600 text-white" : ""
      } ${className}`}
    >
      {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
      {loading ? "Adding..." : added ? "Added" : "Add to cart"}
    </button>
  );
}
