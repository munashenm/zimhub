import Link from "next/link";
import { CategorySidebar } from "@/components/layout/CategorySidebar";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TrustPanel } from "@/components/home/TrustPanel";
import { PromoTabs } from "@/components/home/PromoTabs";
import { ProductSectionHeader } from "@/components/home/ProductSectionHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { getApprovedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { products } = await getApprovedProducts({ limit: 12 });
  const dropShopProducts = products.slice(0, 6);
  const latestProducts = products.slice(0, 8);

  return (
    <div className="container-app py-4 sm:py-6">
      <div className="flex gap-5">
        <CategorySidebar />

        <div className="min-w-0 flex-1">
          <PromoTabs />

          {/* Hero + Trust panel */}
          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <HeroCarousel />
            <TrustPanel />
          </div>

          {/* Drop & Shop section */}
          <section className="mt-8">
            <ProductSectionHeader
              title="Drop & Shop"
              countdown="48"
              href="/search"
            />
            {dropShopProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                {dropShopProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    hotSelling={i === 0}
                    discountPercent={[11, 15, 30, 33, 21, 24][i % 6]}
                  />
                ))}
              </div>
            ) : (
              <EmptyProducts />
            )}
          </section>

          {/* Featured banner */}
          <section className="mt-8 overflow-hidden rounded-lg">
            <div className="relative bg-gradient-to-r from-brand-700 to-brand-900 px-6 py-8 sm:px-10 sm:py-10">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Tough looks good on you
              </h2>
              <p className="mt-1 text-sm text-white/70">Secondhand smartphones & electronics</p>
              <Link
                href="/category/phones"
                className="mt-4 inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
              >
                Shop phones →
              </Link>
            </div>
          </section>

          {/* Latest listings */}
          <section className="mt-8">
            <ProductSectionHeader title="Latest Listings" href="/search" />
            {latestProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {latestProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyProducts />
            )}
          </section>

          {/* Weekend specials promo row */}
          <section className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { title: "Midweek Deals", desc: "Save big every Wednesday", href: "/search?q=deals", color: "bg-brand-600" },
              { title: "Flash Friday", desc: "Weekend specials", href: "/search?q=flash", color: "bg-brand-700" },
              { title: "All Buy Now", desc: "Instant checkout items", href: "/search", color: "bg-brand-800" },
            ].map((promo) => (
              <Link
                key={promo.title}
                href={promo.href}
                className={`${promo.color} rounded-lg px-5 py-6 text-white transition-opacity hover:opacity-90`}
              >
                <h3 className="font-bold">{promo.title}</h3>
                <p className="mt-1 text-sm text-white/70">{promo.desc}</p>
              </Link>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

function EmptyProducts() {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
      <p className="text-gray-500">No products listed yet.</p>
      <Link
        href="/register?seller=true"
        className="mt-4 inline-block rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
      >
        Become a Seller
      </Link>
    </div>
  );
}
