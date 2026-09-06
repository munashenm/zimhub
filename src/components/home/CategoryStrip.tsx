import Link from "next/link";
import { CATEGORIES } from "@/lib/utils";

export function CategoryStrip() {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-brand-300 hover:text-brand-700"
        >
          {cat.icon} {cat.name}
        </Link>
      ))}
    </div>
  );
}
