import { ProductCard } from "@/components/products/ProductCard";
import { getApprovedProducts } from "@/lib/products";
import { CategorySidebar } from "@/components/layout/CategorySidebar";
import { ProductSectionHeader } from "@/components/home/ProductSectionHeader";
import { CATEGORIES } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  if (q?.trim()) return { title: `Search: ${q.trim()}` };
  const cat = CATEGORIES.find((c) => c.slug === category);
  return { title: cat ? cat.name : "All products" };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const query = q?.trim() || "";
  const categoryName = CATEGORIES.find((c) => c.slug === category)?.name;

  const { products, total } = await getApprovedProducts({
    search: query || undefined,
    categorySlug: category || undefined,
    limit: 48,
  });

  const heading = query
    ? `Results for "${query}"`
    : categoryName
      ? categoryName
      : "All products";

  return (
    <div className="container-app py-4 sm:py-6">
      <div className="flex gap-5">
        <CategorySidebar />
        <div className="min-w-0 flex-1">
          <ProductSectionHeader title={heading} href="/category" />
          <p className="mb-4 text-sm text-gray-500">
            {total} {total === 1 ? "product" : "products"} found
          </p>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
              <p className="text-gray-500">
                {query
                  ? `No products found for "${query}"`
                  : "No products listed yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
