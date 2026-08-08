import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getApprovedProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";
import { CategorySidebar } from "@/components/layout/CategorySidebar";
import { ProductSectionHeader } from "@/components/home/ProductSectionHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, categorySeoCopy } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) {
    return buildMetadata({
      title: "Category not found",
      path: `/category/${slug}`,
      noIndex: true,
    });
  }

  const copy = categorySeoCopy(category.name);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: `/category/${category.slug}`,
    keywords: [
      category.name,
      `${category.name} Zimbabwe`,
      `buy ${category.name.toLowerCase()} online Zimbabwe`,
      "ZimHub",
      "Zimbabwe marketplace",
    ],
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) notFound();

  const { products, total } = await getApprovedProducts({ categorySlug: slug });
  const copy = categorySeoCopy(category.name);

  return (
    <div className="container-app py-4 sm:py-6">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: category.name, path: `/category/${category.slug}` },
        ])}
      />
      <div className="flex gap-5">
        <CategorySidebar />
        <div className="min-w-0 flex-1">
          <nav aria-label="Breadcrumb" className="mb-3 text-xs text-gray-400">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            {" / "}
            <span className="text-gray-600">{category.name}</span>
          </nav>

          <h1 className="mb-2 text-2xl font-bold text-gray-900">{copy.title}</h1>
          <p className="mb-4 max-w-3xl text-sm text-gray-600">{copy.intro}</p>

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
              <Link
                href="/register?seller=true"
                className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline"
              >
                List {category.name.toLowerCase()} on ZimHub
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
