export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container-app py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: May 2026</p>

        <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">Information We Collect</h2>
            <p>We collect information you provide when registering (name, email, phone number), seller business details, order and payment information, and usage data when you browse our platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">How We Use Your Information</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>To process orders and facilitate payments</li>
              <li>To verify seller accounts and display trust badges</li>
              <li>To communicate about orders, offers, and support requests</li>
              <li>To improve our platform and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Data Sharing</h2>
            <p>We share necessary order information with sellers to fulfill purchases. Payment data is processed through third-party providers (Paynow, EcoCash). We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Data Security</h2>
            <p>We implement industry-standard security measures to protect your data. Passwords are hashed and never stored in plain text. Payment details are handled by certified payment processors.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data by contacting us at support@zimhub.co.zw or via WhatsApp support.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p>For privacy-related inquiries, contact us at support@zimhub.co.zw or through our WhatsApp support channel.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
