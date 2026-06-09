import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import Link from "next/link";
import { RELATED_LEGAL } from "@/lib/legal-links";

export const metadata = { title: "Buyer Terms" };

export default function BuyerTermsPage() {
  return (
    <LegalPageLayout
      title="Buyer Terms"
      intro="These Buyer Terms apply when you purchase products on ZimHub. They supplement our general Terms & Conditions."
      relatedLinks={[...RELATED_LEGAL("/buyer-terms")]}
      sections={[
        {
          title: "1. Your Agreement",
          content: (
            <p>
              By placing an order on ZimHub, you agree to these Buyer Terms, our{" "}
              <Link href="/terms" className="text-brand-600 hover:underline">
                Terms & Conditions
              </Link>
              , and{" "}
              <Link href="/refund-policy" className="text-brand-600 hover:underline">
                Refund Policy
              </Link>
              . You enter into a direct purchase agreement with the seller, not with
              ZimHub as the product seller.
            </p>
          ),
        },
        {
          title: "2. Browsing & Ordering",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Review product descriptions, photos, condition, and price before ordering</li>
              <li>Ensure your delivery address and phone number are correct at checkout</li>
              <li>
                Use Buy Now for immediate purchase or Make an Offer where the seller
                accepts offers
              </li>
              <li>
                An order is confirmed once payment is received or the seller accepts
                your offer and payment is completed
              </li>
            </ul>
          ),
        },
        {
          title: "3. Payment",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Pay using the methods shown at checkout: Paynow, EcoCash, bank
                transfer, or cash on delivery where available
              </li>
              <li>Prices are shown in USD unless otherwise stated on the listing</li>
              <li>
                You are responsible for any bank or mobile money fees charged by your
                provider
              </li>
              <li>
                Do not send payment directly to a seller outside the platform — this
                voids Buyer Protection
              </li>
            </ul>
          ),
        },
        {
          title: "4. Delivery & Receipt",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Track your order status in your dashboard</li>
              <li>
                Inspect items on delivery and report issues within 7 days of receipt
              </li>
              <li>
                Mark the order as received only when you have the correct item in
                acceptable condition
              </li>
              <li>
                For cash on delivery, inspect before paying the delivery agent or
                seller
              </li>
            </ul>
          ),
        },
        {
          title: "5. Offers & Negotiation",
          content: (
            <p>
              When you submit an offer, the seller may accept, reject, or counter.
              An accepted offer creates the same obligations as a Buy Now purchase
              once you complete payment within the stated timeframe. Withdrawn or
              expired offers do not bind either party.
            </p>
          ),
        },
        {
          title: "6. Reviews & Ratings",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Leave honest reviews based on your actual purchase experience</li>
              <li>Do not post false, abusive, or incentivised reviews</li>
              <li>ZimHub may remove reviews that violate our policies</li>
            </ul>
          ),
        },
        {
          title: "7. Refunds & Disputes",
          content: (
            <p>
              Refund eligibility is set out in our{" "}
              <Link href="/refund-policy" className="text-brand-600 hover:underline">
                Refund Policy
              </Link>
              . Contact the seller first, then escalate to ZimHub support if needed.
              Provide your order number and evidence (photos, messages) to speed up
              resolution.
            </p>
          ),
        },
        {
          title: "8. Buyer Protection",
          content: (
            <p>
              ZimHub Buyer Protection covers eligible orders where the item is not
              received, is significantly not as described, or the seller fails to
              resolve a valid claim. Protection applies only to orders paid through
              ZimHub&apos;s checkout — not to off-platform payments.
            </p>
          ),
        },
        {
          title: "9. Prohibited Buyer Conduct",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>False refund or chargeback claims</li>
              <li>Abusing the offer system or placing fake orders</li>
              <li>Harassing sellers or delivery personnel</li>
              <li>Reselling restricted or prohibited items obtained through the platform</li>
            </ul>
          ),
        },
        {
          title: "10. Account Suspension",
          content: (
            <p>
              ZimHub may restrict or suspend buyer accounts for repeated disputes,
              fraud, or policy violations. You may close your account by contacting
              support, subject to completion or cancellation of open orders.
            </p>
          ),
        },
      ]}
    />
  );
}
