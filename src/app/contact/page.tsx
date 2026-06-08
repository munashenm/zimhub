import Link from "next/link";
import { whatsappUrl } from "@/lib/utils";
import { MessageCircle, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Contact & Support" };

export default function ContactPage() {
  return (
    <div className="container-app py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900">Contact & Support</h1>
        <p className="mt-2 text-gray-600">
          Need help with an order or have a question? We&apos;re here for you.
        </p>

        <div className="mt-10 space-y-6">
          <a
            href={whatsappUrl("Hi ZimHub, I need help with my order.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-6 transition-shadow hover:shadow-md"
          >
            <MessageCircle className="h-8 w-8 text-green-600" />
            <div>
              <h2 className="font-semibold text-gray-900">WhatsApp Support</h2>
              <p className="text-sm text-gray-600">Fastest way to get help — chat with us now</p>
            </div>
          </a>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-brand-600" />
              <div>
                <h2 className="font-semibold text-gray-900">Email</h2>
                <p className="text-sm text-gray-600">support@zimhub.co.zw</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <Phone className="h-6 w-6 text-brand-600" />
              <div>
                <h2 className="font-semibold text-gray-900">Phone</h2>
                <p className="text-sm text-gray-600">+263 77 123 4567 (Mon–Sat, 8am–5pm)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-xl bg-brand-50 p-6 text-center">
          <h2 className="font-semibold text-brand-900">Seller Support</h2>
          <p className="mt-2 text-sm text-gray-600">
            Questions about listing products or getting verified?
          </p>
          <Link href="/register?seller=true" className="mt-4 inline-block">
            <Button>Become a Seller</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
