"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Smartphone,
  Laptop,
  Cpu,
  Shirt,
  Home,
  Car,
  Sprout,
  ShoppingBasket,
  Armchair,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES, cn } from "@/lib/utils";
import { resolveCategorySlug } from "@/lib/category-routes";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  phones: Smartphone,
  computers: Laptop,
  electronics: Cpu,
  fashion: Shirt,
  "home-appliances": Home,
  "car-parts": Car,
  "farming-supplies": Sprout,
  groceries: ShoppingBasket,
  furniture: Armchair,
};

export function CategorySidebar() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const pathSegments = pathname.startsWith("/category/")
    ? pathname.slice("/category/".length).split("/").filter(Boolean)
    : [];
  const activeSlug = resolveCategorySlug(pathSegments);

  return (
    <>
      <aside className="hidden w-[220px] shrink-0 lg:block">
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-4 py-3">
            <Link href="/category" className="text-sm font-bold text-gray-900 hover:text-brand-600">
              Shop by category
            </Link>
          </div>
          <nav className="category-scroll max-h-[520px] overflow-y-auto py-1">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] ?? ShoppingBasket;
              const active = activeSlug === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-brand-50 hover:text-brand-700",
                    active ? "bg-brand-50 font-semibold text-brand-700" : "text-gray-700"
                  )}
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
                className={cn(
                  "block px-4 py-2.5 text-sm hover:bg-brand-50",
                  activeSlug === cat.slug ? "font-semibold text-brand-700" : "text-gray-700"
                )}
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
