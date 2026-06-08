import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductSectionHeaderProps {
  title: string;
  href?: string;
  countdown?: string;
}

export function ProductSectionHeader({
  title,
  href = "/search",
  countdown,
}: ProductSectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-lg bg-brand-600 px-4 py-3 sm:px-6">
      <h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>
      <div className="flex items-center gap-3">
        {countdown && (
          <span className="hidden items-center gap-1.5 text-sm text-white sm:flex">
            You&apos;ve got
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-brand-600">
              {countdown}
            </span>
            hours
          </span>
        )}
        <Link
          href={href}
          className="flex items-center gap-1 rounded-full bg-bob-navy px-4 py-1.5 text-xs font-semibold text-white hover:bg-bob-navy-light sm:text-sm"
        >
          See more
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
