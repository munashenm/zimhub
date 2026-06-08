import { ProductCard } from "@/components/products/ProductCard";
import { getApprovedProducts } from "@/lib/products";
import { CategorySidebar } from "@/components/layout/CategorySidebar";
import { ProductSectionHeader } from "@/components/home/ProductSectionHeader";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : "Search" };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const query = q?.trim() || "";

  const { products, total } = query || category
    ? await getApprovedProducts({ search: query || undefined, categorySlug: category || undefined })
    : { products: [], total: 0 };

  return (
    <div className="container-app py-4 sm:py-6">
      <div className="flex gap-5">
        <CategorySidebar />
        <div className="min-w-0 flex-1">
          <ProductSectionHeader
            title={query ? `Results for "${query}"` : "All Products"}
            href="/search"
          />
          {(query || category) && (
            <p className="mb-4 text-sm text-gray-500">{total} products found</p>
          )}

          {!query && !category ? (
            <p className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
              Use the search bar above to find products.
            </p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
              <p className="text-gray-500">No products found for &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
