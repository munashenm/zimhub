import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { formatPriceParts, parseImages } from "@/lib/utils";
import { SellerBadge } from "@/components/ui/SellerBadge";
import { StarRating } from "@/components/ui/StarRating";
import { ProductActions } from "@/components/products/ProductActions";
import { ReviewSection } from "@/components/products/ReviewSection";
import { Shield, Truck, BadgeCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.title || "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  if (product.status !== "APPROVED") {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Not Available</h1>
        <p className="mt-2 text-gray-500">This listing is not currently available.</p>
        <Link href="/" className="mt-4 inline-block text-brand-600 hover:text-brand-700">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  const productImages = parseImages(product.images);
  const priceParts = formatPriceParts(product.price, product.currency);
  const comparePrice = product.price * 1.15;
  const compareParts = formatPriceParts(comparePrice, product.currency);
  const sellerName = product.seller.sellerProfile?.businessName || product.seller.name;

  return (
    <div className="container-app py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        {" / "}
        <Link href={`/category/${product.category.slug}`} className="hover:text-brand-600">
          {product.category.name}
        </Link>
        {" / "}
        <span className="text-gray-600">{product.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="relative aspect-square bg-gray-50">
            <Image
              src={productImages[0] || "https://placehold.co/600x600?text=No+Image"}
              alt={product.title}
              fill
              className="object-contain p-4"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Details */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
          <Link
            href={`/search?q=${encodeURIComponent(sellerName)}`}
            className="text-sm text-brand-600 hover:underline"
          >
            {sellerName}
          </Link>

          <h1 className="mt-2 text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
            {product.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {product.condition}
            </span>
            <span className="text-xs text-gray-400">{product.stock} available</span>
            {avgRating > 0 && <StarRating rating={avgRating} showValue />}
          </div>

          {/* Bob Shop price display */}
          <div className="mt-5 border-b border-gray-100 pb-5">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-medium text-gray-500">{priceParts.symbol}</span>
              <span className="text-3xl font-bold text-gray-900">{priceParts.main}</span>
              <span className="text-lg font-bold text-gray-900">{priceParts.cents}</span>
            </div>
            <div className="text-sm text-gray-400 line-through">
              {compareParts.symbol}{compareParts.main}{compareParts.cents}
            </div>
          </div>

          {/* Seller trust */}
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <SellerBadge
              status={product.seller.sellerProfile?.verificationStatus ?? null}
              rating={product.seller.sellerProfile?.rating}
              reviewCount={product.seller.sellerProfile?.reviewCount}
              businessName={sellerName}
            />
            {product.seller.sellerProfile?.location && (
              <p className="mt-2 text-xs text-gray-500">
                📍 {product.seller.sellerProfile.location}
              </p>
            )}
          </div>

          <ProductActions
            productId={product.id}
            price={product.price}
            sellerId={product.seller.id}
          />

          {/* Trust icons */}
          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-gray-100 pt-5">
            {[
              { icon: Truck, label: "Tracked delivery" },
              { icon: BadgeCheck, label: "Verified seller" },
              { icon: Shield, label: "Buyer protection" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <item.icon className="mx-auto h-5 w-5 text-brand-600" />
                <p className="mt-1 text-[10px] text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
        <h2 className="text-sm font-bold text-gray-900">Description</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{product.description}</p>
      </div>

      <ReviewSection
        productId={product.id}
        reviews={product.reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt.toISOString(),
          buyer: r.buyer,
        }))}
      />
    </div>
  );
}
