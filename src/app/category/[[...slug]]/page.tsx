import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getApprovedProducts } from "@/lib/products";
import { resolveCategorySlug } from "@/lib/category-routes";
import { ProductCard } from "@/components/products/ProductCard";
import { CategorySidebar } from "@/components/layout/CategorySidebar";
import { ProductSectionHeader } from "@/components/home/ProductSectionHeader";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const categorySlug = resolveCategorySlug(slug);
  if (!categorySlug) return { title: "Category" };

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  return { title: category?.name || "Category" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const categorySlug = resolveCategorySlug(slug);

  if (!categorySlug) notFound();

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });

  if (!category) notFound();

  const { products, total } = await getApprovedProducts({ categorySlug });

  return (
    <div className="container-app py-4 sm:py-6">
      <div className="flex gap-5">
        <CategorySidebar />
        <div className="min-w-0 flex-1">
          <ProductSectionHeader title={category.name} href="/search" />
          <p className="mb-4 text-sm text-gray-500">{total} products found</p>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
              <p className="text-gray-500">No products in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
