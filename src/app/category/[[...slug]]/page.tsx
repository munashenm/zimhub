import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getApprovedProducts } from "@/lib/products";
import { resolveCategorySlug } from "@/lib/category-routes";
import { CATEGORIES } from "@/lib/utils";
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
  if (!slug || slug.length === 0) {
    return { title: "Shop by category" };
  }

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

  if (!slug || slug.length === 0) {
    return <AllCategoriesPage />;
  }

  const categorySlug = resolveCategorySlug(slug);
  if (!categorySlug) notFound();

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) notFound();

  const { products, total } = await getApprovedProducts({
    categorySlug,
    limit: 48,
  });

  return (
    <div className="container-app py-4 sm:py-6">
      <div className="flex gap-5">
        <CategorySidebar />
        <div className="min-w-0 flex-1">
          <ProductSectionHeader title={category.name} href="/search" />
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
              <p className="text-gray-500">No products in this category yet.</p>
              <Link href="/search" className="mt-3 inline-block text-sm font-semibold text-brand-600">
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AllCategoriesPage() {
  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-bold text-gray-900">Shop by category</h1>
      <p className="mt-1 text-sm text-gray-500">Browse listings across Zimbabwe.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="rounded-lg border border-gray-200 bg-white px-4 py-5 text-sm font-semibold text-gray-800 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            <span className="mr-2" aria-hidden="true">
              {cat.icon}
            </span>
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
