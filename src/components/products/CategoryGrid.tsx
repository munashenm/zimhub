import Link from "next/link";
import { CATEGORIES } from "@/lib/utils";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 text-center transition-shadow hover:shadow-md sm:p-4"
        >
          <span className="text-2xl sm:text-3xl">{cat.icon}</span>
          <span className="text-xs font-medium text-gray-700 sm:text-sm">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
