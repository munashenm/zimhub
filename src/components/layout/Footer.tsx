import Link from "next/link";
import { CATEGORIES } from "@/lib/utils";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-200 bg-white">
      {/* Trust bar */}
      <div className="border-b border-gray-100 bg-[#f5f5f5]">
        <div className="container-app grid grid-cols-1 gap-4 py-6 sm:grid-cols-3">
          {[
            { title: "Tracked deliveries", desc: "Every order tracked from seller to you" },
            { title: "Verified sellers", desc: "Identity verified before payouts" },
            { title: "Buyer Protection", desc: "Covered if anything goes wrong" },
          ].map((item) => (
            <div key={item.title} className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container-app py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-gray-500">
              Zimbabwe&apos;s safe and simple marketplace. Buy and sell with verified
              sellers, EcoCash, Paynow, and buyer protection.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-gray-900">Shop</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-sm text-gray-500 hover:text-brand-600">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-gray-900">Sell</h3>
            <ul className="space-y-2">
              <li><Link href="/register?seller=true" className="text-sm text-gray-500 hover:text-brand-600">Sell on ZimHub</Link></li>
              <li><Link href="/seller" className="text-sm text-gray-500 hover:text-brand-600">Seller Dashboard</Link></li>
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-brand-600">How it works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-gray-900">Help</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-sm text-gray-500 hover:text-brand-600">Contact & Support</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-500 hover:text-brand-600">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-brand-600">Privacy Policy</Link></li>
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-brand-600">About Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} ZimHub. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <span>ZimPay</span>
            <span>ZimGo</span>
            <span>ZimBox</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
