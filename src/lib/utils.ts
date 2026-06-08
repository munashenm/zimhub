import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-ZW", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Bob Shop-style price split: US$299 + 99 */
export function formatPriceParts(amount: number, currency = "USD") {
  const symbol = currency === "USD" ? "US$" : currency === "ZWL" ? "ZWL$" : "$";
  const [main, cents] = amount.toFixed(2).split(".");
  const mainFormatted = Number(main).toLocaleString("en-ZW");
  return { symbol, main: mainFormatted, cents: cents || "00" };
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ZM-${timestamp}-${random}`;
}

export const COMMISSION_RATE = parseFloat(
  process.env.PLATFORM_COMMISSION_RATE || "0.05"
);

export const WHATSAPP_NUMBER =
  process.env.WHATSAPP_SUPPORT_NUMBER || "263771234567";

export function whatsappUrl(message?: string) {
  const text = encodeURIComponent(
    message || "Hi ZimHub, I need help with my order."
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export const CATEGORIES = [
  { name: "Phones", slug: "phones", icon: "📱" },
  { name: "Computers", slug: "computers", icon: "💻" },
  { name: "Electronics", slug: "electronics", icon: "🔌" },
  { name: "Fashion", slug: "fashion", icon: "👗" },
  { name: "Home Appliances", slug: "home-appliances", icon: "🏠" },
  { name: "Car Parts", slug: "car-parts", icon: "🚗" },
  { name: "Farming Supplies", slug: "farming-supplies", icon: "🌾" },
  { name: "Groceries", slug: "groceries", icon: "🛒" },
  { name: "Furniture", slug: "furniture", icon: "🪑" },
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Awaiting Payment",
  PAID: "Paid",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export const DELIVERY_STATUSES = [
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

export function parseImages(images: unknown): string[] {
  if (Array.isArray(images)) return images.filter((i): i is string => typeof i === "string");
  return [];
}
