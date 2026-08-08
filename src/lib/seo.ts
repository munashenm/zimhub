import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://www.zimhub.co.zw";

export const SITE_NAME = "ZimHub";

export const SITE_TAGLINE =
  "Zimbabwe's trusted online marketplace — buy & sell safely nationwide";

export const DEFAULT_DESCRIPTION =
  "Shop online on Zimbabwe's safe marketplace. Buy phones, electronics, fashion, farming supplies and more from verified sellers. Pay with EcoCash, Paynow or cash on delivery. Delivery across Harare, Bulawayo, Mutare, Gweru and nationwide.";

export const DEFAULT_KEYWORDS = [
  "ZimHub",
  "Zimbabwe marketplace",
  "buy online Zimbabwe",
  "sell online Zimbabwe",
  "online shopping Zimbabwe",
  "EcoCash shopping",
  "Paynow Zimbabwe",
  "Harare online shop",
  "Bulawayo marketplace",
  "verified sellers Zimbabwe",
  "buy phones Zimbabwe",
  "farming supplies Zimbabwe",
  "Zimbabwe ecommerce",
];

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}

export function truncateMeta(text: string, max = 160) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
}

type BuildMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string | null;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article" | "product";
};

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image,
  keywords = DEFAULT_KEYWORDS,
  noIndex = false,
  type = "website",
}: BuildMetadataInput = {}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title
    ? title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Shop online on Zimbabwe's safe marketplace`;

  const images = image
    ? [{ url: image, width: 1200, height: 630, alt: fullTitle }]
    : undefined;

  return {
    title: title || undefined,
    description: truncateMeta(description),
    keywords,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: truncateMeta(description),
      url,
      siteName: SITE_NAME,
      locale: "en_ZW",
      type: type === "product" ? "website" : type,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: truncateMeta(description),
      ...(image ? { images: [image] } : {}),
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/icon"),
    description: DEFAULT_DESCRIPTION,
    email: "support@zimhub.co.zw",
    telephone: "+263771234567",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ZW",
      addressLocality: "Harare",
    },
    areaServed: {
      "@type": "Country",
      name: "Zimbabwe",
    },
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "en-ZW",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type ProductJsonLdInput = {
  name: string;
  description: string;
  slug: string;
  image: string;
  price: number;
  currency: string;
  condition: string;
  availability?: "InStock" | "OutOfStock";
  brand?: string;
  ratingValue?: number;
  reviewCount?: number;
  category?: string;
};

export function productJsonLd({
  name,
  description,
  slug,
  image,
  price,
  currency,
  condition,
  availability = "InStock",
  brand,
  ratingValue,
  reviewCount,
  category,
}: ProductJsonLdInput) {
  const conditionMap: Record<string, string> = {
    New: "https://schema.org/NewCondition",
    "Used - Like New": "https://schema.org/UsedCondition",
    "Used - Good": "https://schema.org/UsedCondition",
    "Used - Fair": "https://schema.org/UsedCondition",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: truncateMeta(description, 5000),
    image: [image],
    sku: slug,
    category,
    brand: brand
      ? { "@type": "Brand", name: brand }
      : { "@type": "Brand", name: SITE_NAME },
    itemCondition: conditionMap[condition] || "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${slug}`),
      priceCurrency: currency || "USD",
      price: price.toFixed(2),
      availability: `https://schema.org/${availability}`,
      seller: {
        "@type": "Organization",
        name: brand || SITE_NAME,
      },
      areaServed: {
        "@type": "Country",
        name: "Zimbabwe",
      },
    },
    ...(ratingValue && reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(ratingValue.toFixed(1)),
            reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

export function categorySeoCopy(name: string) {
  return {
    title: `${name} for sale in Zimbabwe`,
    description: `Browse ${name.toLowerCase()} for sale on ZimHub — Zimbabwe's trusted marketplace. Verified sellers, EcoCash & Paynow payments, and delivery across Harare, Bulawayo and nationwide.`,
    intro: `Shop ${name.toLowerCase()} online in Zimbabwe on ZimHub. Compare prices from verified local sellers and checkout safely with EcoCash, Paynow, or cash on delivery.`,
  };
}
