"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

const TABS = [
  { label: "Midweek Deals", href: "/search?q=deals", active: true },
  { label: "Flash Friday", href: "/search?q=flash" },
  { label: "More promotions", href: "/search", dropdown: true },
];

export function PromoTabs() {
  return (
    <div className="mb-4 flex items-center gap-1 overflow-x-auto border-b border-gray-200 pb-0">
      {TABS.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          className={`flex shrink-0 items-center gap-1 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            tab.active
              ? "border-brand-500 text-brand-600"
              : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900"
          }`}
        >
          {tab.label}
          {tab.dropdown && <ChevronRight className="h-3.5 w-3.5 rotate-90" />}
        </Link>
      ))}
    </div>
  );
}
