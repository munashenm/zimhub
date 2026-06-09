import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { RELATED_LEGAL } from "@/lib/legal-links";

export const metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      intro="This Refund Policy explains when buyers may request refunds or returns on ZimHub, and how sellers and ZimHub handle those requests."
      relatedLinks={[...RELATED_LEGAL("/refund-policy")]}
      sections={[
        {
          title: "1. Overview",
          content: (
            <p>
              ZimHub is a marketplace — each product is sold by an independent seller.
              Refunds and returns are handled according to this policy, the seller&apos;s
              listing terms, and Zimbabwean consumer protection principles. ZimHub may
              assist in disputes but the seller is primarily responsible for resolving
              refund requests.
            </p>
          ),
        },
        {
          title: "2. When You May Request a Refund",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Item not received</strong> — the order was paid but not
                delivered within the stated or reasonable timeframe
              </li>
              <li>
                <strong>Significantly not as described</strong> — the item differs
                materially from the listing (wrong model, condition, or quantity)
              </li>
              <li>
                <strong>Damaged or defective</strong> — the item arrived damaged or
                does not work as described, where not disclosed in the listing
              </li>
              <li>
                <strong>Counterfeit or prohibited item</strong> — the item is fake,
                illegal, or banned on ZimHub
              </li>
              <li>
                <strong>Duplicate or erroneous charge</strong> — you were charged
                twice or for an order you did not place
              </li>
            </ul>
          ),
        },
        {
          title: "3. When Refunds May Not Apply",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Change of mind after delivery (unless the seller offers returns)</li>
              <li>Minor variations in colour, packaging, or appearance not affecting use</li>
              <li>Items marked as final sale or non-returnable in the listing</li>
              <li>Perishable goods after delivery, unless spoiled on arrival</li>
              <li>Digital goods or services already delivered or activated</li>
              <li>Buyer-provided incorrect delivery address or contact details</li>
            </ul>
          ),
        },
        {
          title: "4. How to Request a Refund",
          content: (
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Contact the seller first through your order details or ZimHub support
                within <strong>7 days</strong> of delivery (or within 14 days if the
                item was not delivered)
              </li>
              <li>
                Provide your order number, a clear description of the issue, and photos
                where relevant
              </li>
              <li>
                If the seller does not respond within 3 business days, escalate to
                ZimHub support via WhatsApp or{" "}
                <a
                  href="mailto:support@zimhub.co.zw"
                  className="text-brand-600 hover:underline"
                >
                  support@zimhub.co.zw
                </a>
              </li>
              <li>
                ZimHub will review the case and may request additional evidence from
                both parties
              </li>
            </ol>
          ),
        },
        {
          title: "5. Refund Methods & Timing",
          content: (
            <>
              <p>Approved refunds are returned using the original payment method where possible:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>EcoCash / Paynow — typically within 3–7 business days</li>
                <li>Bank transfer — within 5–10 business days</li>
                <li>Cash on delivery — refund via EcoCash or bank transfer</li>
              </ul>
              <p className="mt-2">
                Platform commission is refunded only when the full order is cancelled
                before the seller ships. Partial refunds may apply for partial
                returns or negotiated settlements.
              </p>
            </>
          ),
        },
        {
          title: "6. Returns & Exchanges",
          content: (
            <p>
              If a return is approved, the buyer must return the item in its received
              condition (unless damaged in transit) within 7 days of approval. Return
              shipping costs are borne by the seller if the item was not as described;
              otherwise the buyer may pay return shipping unless the seller agrees
              otherwise. Exchanges are subject to seller availability.
            </p>
          ),
        },
        {
          title: "7. Buyer Protection",
          content: (
            <p>
              Where a seller fails to resolve a valid refund claim, ZimHub may step
              in under our Buyer Protection programme. This may include issuing a
              refund from held seller funds or restricting the seller account.
              Eligibility is assessed case by case.
            </p>
          ),
        },
        {
          title: "8. Seller Responsibilities",
          content: (
            <p>
              Sellers must respond to refund requests promptly, honour valid returns,
              and maintain accurate listings. Repeated refund disputes or failure to
              comply may result in account suspension. See our{" "}
              <a href="/seller-terms" className="text-brand-600 hover:underline">
                Seller Terms
              </a>{" "}
              for full obligations.
            </p>
          ),
        },
        {
          title: "9. Contact",
          content: (
            <p>
              For refund assistance, contact ZimHub support at{" "}
              <a
                href="mailto:support@zimhub.co.zw"
                className="text-brand-600 hover:underline"
              >
                support@zimhub.co.zw
              </a>{" "}
              or via WhatsApp with your order number ready.
            </p>
          ),
        },
      ]}
    />
  );
}
