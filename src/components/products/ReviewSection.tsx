"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  buyer: { name: string };
}

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
}

export function ReviewSection({ productId, reviews: initialReviews }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setReviews([
        {
          id: data.id,
          rating: data.rating,
          comment: data.comment,
          createdAt: new Date().toISOString(),
          buyer: { name: session?.user?.name || "You" },
        },
        ...reviews,
      ]);
      setComment("");
      setMessage("Review submitted!");
    } else {
      setMessage(data.error || "Failed to submit review");
    }
  };

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold text-gray-900">
        Reviews ({reviews.length})
      </h2>

      {session && (
        <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-3">
          {message && (
            <div className="rounded-lg bg-brand-50 p-3 text-sm text-brand-800">{message}</div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <Textarea
            label="Your Review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Share your experience with this product..."
          />
          <Button type="submit" loading={loading}>Submit Review</Button>
        </form>
      )}

      <div className="mt-8 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{review.buyer.name}</span>
                <StarRating rating={review.rating} />
              </div>
              {review.comment && (
                <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString("en-ZW")}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
