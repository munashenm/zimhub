import Link from "next/link";
import Image from "next/image";
import { CategorySidebar } from "@/components/layout/CategorySidebar";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TrustPanel } from "@/components/home/TrustPanel";
import { PromoTabs } from "@/components/home/PromoTabs";
import { ProductSectionHeader } from "@/components/home/ProductSectionHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { getApprovedProducts } from "@/lib/products";
import { POSTERS } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { products } = await getApprovedProducts({ limit: 18 });
  const dropShopProducts = products.slice(0, 6);
  const latestProducts = products.slice(0, 12);

  return (
    <div className="container-app py-4 sm:py-6">
      <div className="flex gap-5">
        <CategorySidebar />

        <div className="min-w-0 flex-1">
          <PromoTabs />

          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <HeroCarousel />
            <TrustPanel />
          </div>

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

          <section className="mt-8 overflow-hidden rounded-lg">
            <div className="relative min-h-[160px] px-6 py-8 sm:min-h-[180px] sm:px-10 sm:py-10">
              <Image
                src={POSTERS.phones}
                alt="Smartphones and electronics on ZimHub"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-800/75 to-brand-700/40" />
              <div className="relative">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  Tough looks good on you
                </h2>
                <p className="mt-1 text-sm text-white/70">
                  Phones &amp; electronics at current Zimbabwe market prices
                </p>
                <Link
                  href="/category/phones"
                  className="mt-4 inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                >
                  Shop phones →
                </Link>
              </div>
            </div>
          </section>

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

          <section className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              {
                title: "Midweek Deals",
                desc: "Save big every Wednesday",
                href: "/search?q=deals",
                image: POSTERS.marketplace,
              },
              {
                title: "Flash Friday",
                desc: "Weekend specials",
                href: "/search?q=flash",
                image: POSTERS.payments,
              },
              {
                title: "All Buy Now",
                desc: "Instant checkout items",
                href: "/search",
                image: POSTERS.sell,
              },
            ].map((promo) => (
              <Link
                key={promo.title}
                href={promo.href}
                className="relative overflow-hidden rounded-lg px-5 py-6 text-white transition-opacity hover:opacity-95"
              >
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-brand-900/70" />
                <div className="relative">
                  <h3 className="font-bold">{promo.title}</h3>
                  <p className="mt-1 text-sm text-white/70">{promo.desc}</p>
                </div>
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
