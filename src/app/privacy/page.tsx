import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { RELATED_LEGAL } from "@/lib/legal-links";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      intro="ZimHub (www.zimhub.co.zw) respects your privacy. This policy explains what information we collect, how we use it, and your rights when you use our marketplace."
      relatedLinks={[...RELATED_LEGAL("/privacy")]}
      sections={[
        {
          title: "1. Who We Are",
          content: (
            <p>
              ZimHub is an online marketplace operating in Zimbabwe that connects
              buyers and sellers. For privacy enquiries, contact us at{" "}
              <a
                href="mailto:support@zimhub.co.zw"
                className="text-brand-600 hover:underline"
              >
                support@zimhub.co.zw
              </a>
              .
            </p>
          ),
        },
        {
          title: "2. Information We Collect",
          content: (
            <>
              <p>We may collect the following information:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  <strong>Account data:</strong> name, email address, phone number,
                  password (stored as a secure hash), and account role (buyer,
                  seller, or admin)
                </li>
                <li>
                  <strong>Seller data:</strong> business name, description, location,
                  verification documents, and payout details where applicable
                </li>
                <li>
                  <strong>Transaction data:</strong> orders, offers, payment method,
                  delivery address, and order history
                </li>
                <li>
                  <strong>Usage data:</strong> pages visited, search queries, device
                  type, browser, and IP address
                </li>
                <li>
                  <strong>Communications:</strong> messages sent to our support team
                  via email or WhatsApp
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "3. How We Use Your Information",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>To create and manage your account</li>
              <li>To process orders, payments, and seller payouts</li>
              <li>To verify sellers and display trust badges</li>
              <li>To send order updates, notifications, and support responses</li>
              <li>To prevent fraud, abuse, and unauthorised access</li>
              <li>To improve our platform and user experience</li>
              <li>To comply with legal and regulatory obligations in Zimbabwe</li>
            </ul>
          ),
        },
        {
          title: "4. How We Share Information",
          content: (
            <>
              <p>We do not sell your personal information. We may share data with:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  <strong>Sellers</strong> — order and delivery details needed to
                  fulfil your purchase
                </li>
                <li>
                  <strong>Buyers</strong> — seller business name and contact details
                  relevant to an order
                </li>
                <li>
                  <strong>Payment processors</strong> — Paynow, EcoCash, and banks to
                  process transactions
                </li>
                <li>
                  <strong>Service providers</strong> — hosting, analytics, and support
                  tools that help us operate the platform
                </li>
                <li>
                  <strong>Authorities</strong> — when required by law or to protect
                  our users and platform
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "5. Cookies & Tracking",
          content: (
            <p>
              We use essential cookies to keep you logged in and remember your
              preferences. We may use analytics tools to understand how the site is
              used. You can control cookies through your browser settings, though some
              features may not work if cookies are disabled.
            </p>
          ),
        },
        {
          title: "6. Data Security",
          content: (
            <p>
              We use industry-standard measures to protect your data, including
              encrypted connections (HTTPS), hashed passwords, and access controls.
              Payment card and mobile money details are handled by certified payment
              processors — we do not store full payment credentials on our servers.
            </p>
          ),
        },
        {
          title: "7. Data Retention",
          content: (
            <p>
              We retain account and transaction data for as long as your account is
              active or as needed to fulfil orders, resolve disputes, and meet legal
              requirements. You may request deletion of your account, subject to
              records we must keep for compliance.
            </p>
          ),
        },
        {
          title: "8. Your Rights",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Withdraw consent where processing is based on consent</li>
              <li>Lodge a complaint with a relevant data protection authority</li>
            </ul>
          ),
        },
        {
          title: "9. Children",
          content: (
            <p>
              ZimHub is not intended for users under 18 years of age. We do not
              knowingly collect personal information from children. If you believe a
              child has registered, contact us and we will remove the account.
            </p>
          ),
        },
        {
          title: "10. Changes to This Policy",
          content: (
            <p>
              We may update this Privacy Policy from time to time. Material changes
              will be posted on this page with an updated date. Continued use of
              ZimHub after changes constitutes acceptance of the revised policy.
            </p>
          ),
        },
      ]}
    />
  );
}
