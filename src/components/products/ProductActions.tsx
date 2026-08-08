"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Tag, Zap } from "lucide-react";

interface ProductActionsProps {
  productId: string;
  price: number;
  sellerId: string;
}

export function ProductActions({ productId, price, sellerId }: ProductActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [showOffer, setShowOffer] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isOwnProduct = session?.user?.id === sellerId;

  const handleAddToCart = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/product/${productId}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        toast("Added to cart");
      } else {
        toast("Could not add to cart. Try again.", "error");
      }
    } catch {
      toast("Could not add to cart. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!session) {
      router.push(`/login?callbackUrl=/checkout?product=${productId}`);
      return;
    }
    router.push(`/checkout?product=${productId}`);
  };

  const handleOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          amount: parseFloat(offerAmount),
          message: offerMessage,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast("Offer submitted — the seller will respond soon");
        setShowOffer(false);
        setOfferAmount("");
        setOfferMessage("");
      } else {
        toast(data.error || "Failed to submit offer", "error");
      }
    } catch {
      toast("Failed to submit offer", "error");
    } finally {
      setLoading(false);
    }
  };

  if (isOwnProduct) {
    return (
      <div className="mt-8 rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-600">
        This is your listing.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-3">
      <Button
        onClick={handleBuyNow}
        size="lg"
        className="w-full transition-transform active:scale-[0.99]"
      >
        <Zap className="h-5 w-5" />
        Buy Now — {formatPrice(price)}
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={handleAddToCart} variant="outline" loading={loading}>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
        <Button
          onClick={() => setShowOffer(!showOffer)}
          variant="ghost"
          className="border border-gray-200"
        >
          <Tag className="h-4 w-4" />
          Make an Offer
        </Button>
      </div>

      {showOffer && (
        <form
          onSubmit={handleOffer}
          className="animate-fade-up space-y-3 rounded-xl border border-gray-200 p-4"
        >
          <Input
            label={`Your Offer (must be less than ${formatPrice(price)})`}
            type="number"
            step="0.01"
            min="0.01"
            max={price - 0.01}
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            required
          />
          <Textarea
            label="Message to Seller (optional)"
            value={offerMessage}
            onChange={(e) => setOfferMessage(e.target.value)}
            rows={2}
            placeholder="Hi, I'm interested in this item..."
          />
          <Button type="submit" loading={loading} className="w-full">
            Submit Offer
          </Button>
        </form>
      )}

      {!session && (
        <p className="text-center text-sm text-gray-500">
          <Link href="/login" className="font-semibold text-brand-600">
            Sign in
          </Link>{" "}
          to buy or make an offer
        </p>
      )}
    </div>
  );
}
