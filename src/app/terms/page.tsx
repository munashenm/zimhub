export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="container-app py-12">
      <div className="mx-auto max-w-3xl prose prose-gray">
        <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
        <p className="text-sm text-gray-500">Last updated: May 2026</p>

        <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
            <p>By accessing and using ZimHub, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. User Accounts</h2>
            <p>Buyers and sellers must register with accurate information. Sellers undergo a verification process before receiving a verified badge. You are responsible for maintaining the confidentiality of your account credentials.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. Buying & Selling</h2>
            <p>All product listings are subject to admin approval before going live. Sellers must accurately describe their products. Buyers may purchase via Buy Now or submit offers where available. ZimHub facilitates transactions but is not the seller of listed products.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Payments</h2>
            <p>Payments are processed through Paynow, EcoCash, bank transfer, or cash on delivery. ZimHub charges a commission on each completed sale, deducted from the seller&apos;s payout.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Delivery</h2>
            <p>Sellers are responsible for fulfilling orders and updating delivery status. ZimHub is not liable for delays caused by third-party delivery services or circumstances beyond our control.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Disputes</h2>
            <p>Disputes between buyers and sellers should first be resolved directly. ZimHub may mediate disputes at its discretion. Contact support via WhatsApp or email for assistance.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Limitation of Liability</h2>
            <p>ZimHub provides the platform &quot;as is&quot; and makes no warranties regarding product quality, seller conduct, or transaction outcomes beyond our verification and approval processes.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
