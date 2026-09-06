import { CATEGORIES } from "./utils";

/** Map Bob Shop / nested paths to ZimHub category slugs. */
const CATEGORY_PATH_ALIASES: Record<string, string> = {
  "computing-office": "computers",
  "computing-office/laptops": "computers",
  "computing-office/desktops": "computers",
  "computing-office/tablets": "computers",
  digital: "phones",
  "digital/phones": "phones",
  "digital/smartphones": "phones",
  "home-garden": "groceries",
  "home-garden-groceries": "groceries",
  "home-appliances": "home-appliances",
  automotive: "car-parts",
  fashion: "fashion",
  "fashion-jewellery": "fashion",
  electronics: "electronics",
  farming: "farming-supplies",
  "farming-supplies": "farming-supplies",
  furniture: "furniture",
  "toys-baby": "fashion",
  "sports-health": "electronics",
  lifestyle: "furniture",
  collectables: "electronics",
  "business-industry": "farming-supplies",
  laptops: "computers",
  computers: "computers",
  phones: "phones",
  groceries: "groceries",
  "car-parts": "car-parts",
};

const VALID_SLUGS = new Set<string>(CATEGORIES.map((c) => c.slug));

/** Resolve URL path segments to a database category slug. */
export function resolveCategorySlug(segments: string[] | undefined): string | null {
  if (!segments || segments.length === 0) return null;

  const path = segments
    .map((segment) => decodeURIComponent(segment).toLowerCase())
    .join("/");

  if (CATEGORY_PATH_ALIASES[path]) return CATEGORY_PATH_ALIASES[path];

  const last = segments[segments.length - 1]?.toLowerCase();
  if (last && CATEGORY_PATH_ALIASES[last]) return CATEGORY_PATH_ALIASES[last];
  if (last && VALID_SLUGS.has(last)) return last;

  const first = segments[0]?.toLowerCase();
  if (first && CATEGORY_PATH_ALIASES[first]) return CATEGORY_PATH_ALIASES[first];
  if (first && VALID_SLUGS.has(first)) return first;

  return null;
}
