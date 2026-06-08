import { BadgeCheck, Clock, XCircle } from "lucide-react";
import { Badge } from "./Badge";

interface SellerBadgeProps {
  status: string | null;
  rating?: number;
  reviewCount?: number;
  businessName?: string;
}

export function SellerBadge({
  status,
  rating,
  reviewCount,
  businessName,
}: SellerBadgeProps) {
  if (status === "VERIFIED") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success" className="gap-1">
          <BadgeCheck className="h-3 w-3" />
          Verified Seller
        </Badge>
        {businessName && (
          <span className="text-sm font-medium text-gray-700">
            {businessName}
          </span>
        )}
        {rating !== undefined && rating > 0 && (
          <span className="text-sm text-gray-500">
            ★ {rating.toFixed(1)} ({reviewCount} reviews)
          </span>
        )}
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <Badge variant="warning" className="gap-1">
        <Clock className="h-3 w-3" />
        Verification Pending
      </Badge>
    );
  }

  if (status === "REJECTED") {
    return (
      <Badge variant="danger" className="gap-1">
        <XCircle className="h-3 w-3" />
        Not Verified
      </Badge>
    );
  }

  return null;
}
