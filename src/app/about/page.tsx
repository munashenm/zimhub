export const metadata = { title: "About Us" };

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
              <li>✅ Verified seller badges for trusted shopping</li>
              <li>✅ Buy Now checkout — simple and fast</li>
              <li>✅ Make an Offer on select listings</li>
              <li>✅ Local payments: EcoCash, Paynow, Cash on Delivery</li>
              <li>✅ WhatsApp support for quick help</li>
              <li>✅ Mobile-first design for shopping on the go</li>
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
          </section>
        </div>
      </div>
    </div>
  );
}
