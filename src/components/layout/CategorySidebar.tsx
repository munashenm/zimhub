"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Smartphone,
  Home,
  Baby,
  Shirt,
  Dumbbell,
  Sparkles,
  Gem,
  Car,
  Briefcase,
  Grid3X3,
  ChevronRight,
} from "lucide-react";
import { CATEGORIES } from "@/lib/utils";

const SIDEBAR_CATEGORIES = [
  { name: "Digital", slug: "phones", icon: Smartphone },
  { name: "Home, Garden & Groceries", slug: "groceries", icon: Home },
  { name: "Toys & Baby", slug: "fashion", icon: Baby },
  { name: "Fashion & Jewellery", slug: "fashion", icon: Shirt },
  { name: "Sports & Health", slug: "electronics", icon: Dumbbell },
  { name: "Lifestyle", slug: "furniture", icon: Sparkles },
  { name: "Collectables", slug: "electronics", icon: Gem },
  { name: "Automotive", slug: "car-parts", icon: Car },
  { name: "Business & Industry", slug: "farming-supplies", icon: Briefcase },
  { name: "Other Categories", slug: "computers", icon: Grid3X3 },
];

export function CategorySidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-[220px] shrink-0 lg:block">
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-bold text-gray-900">Shop by category</h2>
          </div>
          <nav className="category-scroll max-h-[520px] overflow-y-auto py-1">
            {SIDEBAR_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 leading-tight">{cat.name}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile category toggle */}
      <div className="mb-4 lg:hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold"
        >
          Shop by category
          <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>
        {expanded && (
          <div className="mt-1 rounded-lg border border-gray-200 bg-white py-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50"
                onClick={() => setExpanded(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
