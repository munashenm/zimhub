import Link from "next/link";
import { whatsappUrl } from "@/lib/utils";

export function TopBar() {
  return (
    <div className="bg-bob-navy text-white">
      <div className="container-app flex h-9 items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-brand-400">
            Help +263 77 123 4567
          </a>
          <Link href="/register?seller=true" className="hidden hover:text-brand-400 sm:inline">
            Sell on ZimHub
          </Link>
          <Link href="/search" className="hidden hover:text-brand-400 md:inline">
            Stores
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium text-brand-400">ZimHub</span>
          <Link href="/checkout" className="hidden hover:text-brand-400 sm:inline">
            ZimPay
          </Link>
          <Link href="/contact" className="hidden hover:text-brand-400 sm:inline">
            ZimGo
          </Link>
          <Link href="/contact" className="hidden hover:text-brand-400 lg:inline">
            ZimBox
          </Link>
        </div>
      </div>
    </div>
  );
}
