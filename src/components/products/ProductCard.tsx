import Link from "next/link";
import Image from "next/image";
import { formatPriceParts, parseImages, cn } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    currency: string;
    images: unknown;
    condition: string;
    seller?: {
      name: string;
      sellerProfile?: {
        verificationStatus: string;
        businessName?: string;
      } | null;
    };
  };
  hotSelling?: boolean;
  discountPercent?: number;
  className?: string;
}

export function ProductCard({
  product,
  hotSelling = false,
  discountPercent,
  className,
}: ProductCardProps) {
  const productImages = parseImages(product.images);
  const comparePrice = discountPercent
    ? product.price / (1 - discountPercent / 100)
    : product.price * 1.15;
  const discount = discountPercent ?? Math.round((1 - product.price / comparePrice) * 100);
  const priceParts = formatPriceParts(product.price, product.currency);
  const compareParts = formatPriceParts(comparePrice, product.currency);
  const sellerName =
    product.seller?.sellerProfile?.businessName || product.seller?.name || "Seller";

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md",
        className
      )}
    >
      <Link href={`/product/${product.slug}`} className="relative block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={productImages[0] || "https://placehold.co/400x400?text=No+Image"}
            alt={product.title}
            fill
            className="object-contain p-2 transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          {hotSelling && (
            <span className="absolute left-2 top-2 rounded bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              Hot selling
            </span>
          )}
          {discount > 0 && (
            <span className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold leading-tight text-white">
              {discount}% off
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm leading-snug text-gray-800 group-hover:text-brand-600">
            {product.title}
          </h3>
        </Link>

        <Link
          href={`/search?q=${encodeURIComponent(sellerName)}`}
          className="mt-1 text-xs text-gray-400 hover:text-brand-600 hover:underline"
        >
          {sellerName}
        </Link>

        <span className="mt-1.5 inline-flex w-fit rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
          {product.condition}
        </span>

        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xs font-medium text-gray-500">{priceParts.symbol}</span>
          <span className="text-xl font-bold text-gray-900">{priceParts.main}</span>
          <span className="text-sm font-bold text-gray-900">{priceParts.cents}</span>
        </div>
        {discount > 0 && (
          <div className="text-xs text-gray-400 line-through">
            {compareParts.symbol}
            {compareParts.main}
            {compareParts.cents}
          </div>
        )}

        <div className="mt-auto pt-3">
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
