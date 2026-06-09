import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import Link from "next/link";
import { RELATED_LEGAL } from "@/lib/legal-links";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      intro="These Terms & Conditions govern your use of ZimHub. By accessing or using our platform, you agree to these terms and our related policies."
      relatedLinks={[...RELATED_LEGAL("/terms")]}
      sections={[
        {
          title: "1. Acceptance of Terms",
          content: (
            <p>
              By registering, browsing, buying, or selling on ZimHub, you agree to
              these Terms & Conditions, our{" "}
              <Link href="/privacy" className="text-brand-600 hover:underline">
                Privacy Policy
              </Link>
              ,{" "}
              <Link href="/refund-policy" className="text-brand-600 hover:underline">
                Refund Policy
              </Link>
              ,{" "}
              <Link href="/buyer-terms" className="text-brand-600 hover:underline">
                Buyer Terms
              </Link>
              , and{" "}
              <Link href="/seller-terms" className="text-brand-600 hover:underline">
                Seller Terms
              </Link>
              . If you do not agree, do not use the platform.
            </p>
          ),
        },
        {
          title: "2. About ZimHub",
          content: (
            <p>
              ZimHub is a marketplace platform that connects buyers and sellers in
              Zimbabwe. ZimHub facilitates listings, orders, and payments but is not
              the seller of products listed by third-party sellers unless explicitly
              stated. Each sale is a contract between the buyer and the seller.
            </p>
          ),
        },
        {
          title: "3. Eligibility",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>You must be at least 18 years old to use ZimHub</li>
              <li>You must provide accurate and complete registration information</li>
              <li>You must not use the platform for illegal or fraudulent activity</li>
              <li>
                One person or business may not maintain multiple accounts to evade
                restrictions or bans
              </li>
            </ul>
          ),
        },
        {
          title: "4. Accounts & Security",
          content: (
            <p>
              You are responsible for all activity under your account and for keeping
              your login credentials confidential. Notify us immediately if you
              suspect unauthorised access. ZimHub may suspend or terminate accounts
              that violate these terms or pose a risk to other users.
            </p>
          ),
        },
        {
          title: "5. Listings & Orders",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>All listings are subject to admin approval before going live</li>
              <li>Sellers must accurately describe products, condition, and pricing</li>
              <li>Buyers may purchase via Buy Now or submit offers where enabled</li>
              <li>
                Order confirmation creates a binding agreement between buyer and
                seller, subject to payment and availability
              </li>
            </ul>
          ),
        },
        {
          title: "6. Payments & Commission",
          content: (
            <p>
              Payments may be made via Paynow, EcoCash, bank transfer, or cash on
              delivery where available. ZimHub charges a platform commission on
              completed sales (currently 5% unless otherwise stated), deducted from
              the seller&apos;s payout. All prices are displayed in USD unless
              otherwise indicated.
            </p>
          ),
        },
        {
          title: "7. Delivery",
          content: (
            <p>
              Sellers are responsible for packing, shipping, and updating delivery
              status. Delivery times and costs are set by the seller unless ZimHub
              offers a delivery service. ZimHub is not liable for delays caused by
              couriers, customs, or events outside reasonable control.
            </p>
          ),
        },
        {
          title: "8. Prohibited Conduct",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Listing counterfeit, stolen, or illegal goods</li>
              <li>Misrepresenting products, identity, or business credentials</li>
              <li>Manipulating reviews, ratings, or platform metrics</li>
              <li>Harassing other users or ZimHub staff</li>
              <li>Attempting to bypass platform fees or conduct off-platform deals</li>
              <li>Uploading malware, spam, or harmful content</li>
            </ul>
          ),
        },
        {
          title: "9. Intellectual Property",
          content: (
            <p>
              ZimHub&apos;s name, logo, design, and software are owned by ZimHub. You
              may not copy or use our branding without permission. Sellers retain
              ownership of their product images and descriptions but grant ZimHub a
              licence to display them on the platform.
            </p>
          ),
        },
        {
          title: "10. Disputes & Limitation of Liability",
          content: (
            <p>
              Disputes between buyers and sellers should first be resolved directly.
              ZimHub may mediate at its discretion but is not obligated to do so.
              ZimHub provides the platform &quot;as is&quot; and is not liable for
              product quality, seller conduct, or losses beyond our verification and
              buyer protection processes. Our total liability is limited to the fees
              paid to ZimHub for the relevant transaction.
            </p>
          ),
        },
        {
          title: "11. Termination",
          content: (
            <p>
              You may close your account at any time by contacting support. ZimHub may
              suspend or terminate access for violations of these terms, fraud, or
              legal requirements. Outstanding orders and payouts will be handled in
              accordance with our policies.
            </p>
          ),
        },
        {
          title: "12. Governing Law",
          content: (
            <p>
              These terms are governed by the laws of Zimbabwe. Any disputes not
              resolved through our support process may be referred to the courts of
              Zimbabwe.
            </p>
          ),
        },
      ]}
    />
  );
}
