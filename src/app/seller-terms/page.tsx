import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import Link from "next/link";
import { RELATED_LEGAL } from "@/lib/legal-links";

export const metadata = { title: "Seller Terms" };

export default function SellerTermsPage() {
  return (
    <LegalPageLayout
      title="Seller Terms"
      intro="These Seller Terms apply when you list and sell products on ZimHub. They supplement our general Terms & Conditions."
      relatedLinks={[...RELATED_LEGAL("/seller-terms")]}
      sections={[
        {
          title: "1. Your Agreement",
          content: (
            <p>
              By registering as a seller and listing products, you agree to these
              Seller Terms, our{" "}
              <Link href="/terms" className="text-brand-600 hover:underline">
                Terms & Conditions
              </Link>
              ,{" "}
              <Link href="/refund-policy" className="text-brand-600 hover:underline">
                Refund Policy
              </Link>
              , and{" "}
              <Link href="/privacy" className="text-brand-600 hover:underline">
                Privacy Policy
              </Link>
              . You are responsible for the products you sell and for complying with
              Zimbabwean law.
            </p>
          ),
        },
        {
          title: "2. Registration & Verification",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Provide accurate business name, contact details, and location</li>
              <li>
                Complete identity verification before receiving a Verified Seller badge
                and payouts
              </li>
              <li>
                Keep your profile up to date and notify ZimHub of material changes
              </li>
              <li>
                ZimHub may reject or revoke verification if information is false or
                incomplete
              </li>
            </ul>
          ),
        },
        {
          title: "3. Listing Products",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>
                All listings require admin approval before appearing on the marketplace
              </li>
              <li>
                Use clear titles, accurate descriptions, honest condition labels, and
                your own photos or photos you have rights to use
              </li>
              <li>Set fair prices in USD unless otherwise agreed with ZimHub</li>
              <li>Maintain accurate stock levels — do not sell items you cannot deliver</li>
              <li>
                Do not list counterfeit, stolen, dangerous, or prohibited goods
              </li>
            </ul>
          ),
        },
        {
          title: "4. Prohibited Listings",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Counterfeit or pirated goods</li>
              <li>Weapons, drugs, and other illegal items</li>
              <li>Adult content or services not permitted on the platform</li>
              <li>Items that infringe intellectual property rights</li>
              <li>Misleading health, financial, or lottery schemes</li>
            </ul>
          ),
        },
        {
          title: "5. Orders & Fulfilment",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Accept or reject offers within a reasonable time</li>
              <li>Ship or prepare orders within the timeframe stated in your listing</li>
              <li>Update order status (processing, shipped, delivered) in your dashboard</li>
              <li>Pack items securely to prevent damage in transit</li>
              <li>Provide tracking or proof of delivery where applicable</li>
            </ul>
          ),
        },
        {
          title: "6. Payments & Commission",
          content: (
            <>
              <p>
                ZimHub collects payment from buyers on your behalf. After a successful
                sale and delivery (or as per our payout schedule), your payout is
                calculated as:
              </p>
              <p className="mt-2 rounded-lg bg-gray-50 px-4 py-3 font-medium text-gray-800">
                Seller payout = Sale amount − Platform commission (currently 5%)
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Payouts are made to verified sellers via EcoCash or bank transfer</li>
                <li>
                  ZimHub may hold funds during dispute investigation or for new
                  unverified sellers
                </li>
                <li>You are responsible for taxes and ZIMRA obligations on your sales</li>
              </ul>
            </>
          ),
        },
        {
          title: "7. Refunds & Returns",
          content: (
            <p>
              You must honour valid refund and return requests under our{" "}
              <Link href="/refund-policy" className="text-brand-600 hover:underline">
                Refund Policy
              </Link>
              . Respond to buyer claims within 3 business days. Failure to resolve
              disputes may result in refunds deducted from your account or withheld
              payouts.
            </p>
          ),
        },
        {
          title: "8. Customer Service",
          content: (
            <p>
              Respond to buyer enquiries and order issues promptly and professionally.
              Poor ratings, high cancellation rates, or unresolved disputes may affect
              your visibility on the platform and eligibility for verified status.
            </p>
          ),
        },
        {
          title: "9. Intellectual Property",
          content: (
            <p>
              You warrant that your listings, images, and content do not infringe
              third-party rights. You grant ZimHub a non-exclusive licence to display
              your listing content on the platform and in marketing materials. ZimHub
              may remove listings that receive valid copyright or trademark complaints.
            </p>
          ),
        },
        {
          title: "10. Suspension & Termination",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>
                ZimHub may suspend listings or accounts for policy violations, fraud,
                or legal requirements
              </li>
              <li>
                Outstanding orders must still be fulfilled or refunded upon suspension
              </li>
              <li>
                You may request account closure after completing or cancelling active
                orders
              </li>
            </ul>
          ),
        },
        {
          title: "11. Becoming a Seller",
          content: (
            <p>
              Ready to sell?{" "}
              <Link
                href="/register?seller=true"
                className="text-brand-600 hover:underline"
              >
                Register as a seller
              </Link>{" "}
              and complete verification to start listing products on ZimHub.
            </p>
          ),
        },
      ]}
    />
  );
}
