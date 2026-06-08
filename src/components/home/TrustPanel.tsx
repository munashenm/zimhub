import { Truck, BadgeCheck, Shield } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: Truck,
    title: "Tracked deliveries",
    desc: "Every order is tracked from the seller to you.",
    href: "/about",
  },
  {
    icon: BadgeCheck,
    title: "Verified sellers",
    desc: "We pay sellers once their identity is verified.",
    href: "/about",
  },
  {
    icon: Shield,
    title: "Buyer Protection",
    desc: "You're covered if anything goes wrong.",
    href: "/terms",
  },
];

export function TrustPanel() {
  return (
    <div className="flex flex-col gap-3">
      <div className="hidden rounded-lg bg-brand-600 sm:block sm:h-24 lg:h-32" />
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {FEATURES.map((f, i) => (
          <Link
            key={f.title}
            href={f.href}
            className={`flex items-start gap-3 px-4 py-4 hover:bg-gray-50 ${
              i < FEATURES.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <f.icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{f.title}</h3>
              <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
