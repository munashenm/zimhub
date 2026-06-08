import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  showValue?: boolean;
}

export function StarRating({
  rating,
  max = 5,
  size = "sm",
  showValue = false,
}: StarRatingProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              iconSize,
              i < Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
