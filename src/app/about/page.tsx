import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { CATEGORIES } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "About ZimHub — Zimbabwe's online marketplace",
  description:
    "Learn about ZimHub, Zimbabwe's trusted online marketplace connecting buyers and sellers from Harare to Bulawayo with verified sellers, EcoCash, Paynow, and buyer protection.",
  path: "/about",
  keywords: [
    "About ZimHub",
    "Zimbabwe marketplace",
    "online shopping Zimbabwe",
    "sell online Zimbabwe",
  ],
});

export default function AboutPage() {
  return (
    <div className="container-app py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">About ZimHub</h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          ZimHub is Zimbabwe&apos;s trusted online marketplace, built to connect buyers
          and sellers across the country — from Harare to Bulawayo, Mutare to Gweru.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              We believe every Zimbabwean deserves a safe, simple way to buy and sell online.
              ZimHub provides verified sellers, secure checkout, local payment options like
              EcoCash and Paynow, and transparent order tracking — all designed for the
              Zimbabwean market.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Why ZimHub?</h2>
            <ul className="mt-3 space-y-2 text-gray-600">
              <li>Verified seller badges for trusted shopping</li>
              <li>Buy Now checkout — simple and fast</li>
              <li>Make an Offer on select listings</li>
              <li>Local payments: EcoCash, Paynow, Cash on Delivery</li>
              <li>WhatsApp support for quick help</li>
              <li>Mobile-first design for shopping on the go</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Shop popular categories</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Discover phones, computers, electronics, fashion, farming supplies, groceries,
              and more from sellers across Zimbabwe.
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-brand-700 hover:underline">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">For Sellers</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Register as a seller, get verified by our team, and start listing your products.
              We handle payments, track commissions transparently, and help you reach buyers
              nationwide. Whether you&apos;re selling phones in Harare or farming supplies in
              Masvingo, ZimHub is your platform.
            </p>
            <Link
              href="/register?seller=true"
              className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline"
            >
              Start selling on ZimHub →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
