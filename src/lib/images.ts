/** Default image when a listing has no photo */
export const PRODUCT_FALLBACK_IMAGE = "/images/product-fallback.jpg";

export const POSTERS = {
  marketplace: "/images/posters/hero-marketplace.jpg",
  payments: "/images/posters/hero-payments.jpg",
  sell: "/images/posters/hero-sell.jpg",
  delivery: "/images/posters/promo-delivery.jpg",
  phones: "/images/posters/banner-phones.jpg",
} as const;

export function productImage(src?: string | null) {
  return src && src.trim() ? src : PRODUCT_FALLBACK_IMAGE;
}
