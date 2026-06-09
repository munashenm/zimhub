import Link from "next/link";

export interface LegalSection {
  title: string;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  intro?: string;
  sections: LegalSection[];
  relatedLinks?: { href: string; label: string }[];
}

export function LegalPageLayout({
  title,
  intro,
  sections,
  relatedLinks,
}: LegalPageLayoutProps) {
  return (
    <div className="container-app py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">Last updated: June 2026</p>
        {intro && (
          <p className="mt-4 text-gray-600 leading-relaxed">{intro}</p>
        )}

        <div className="mt-8 space-y-8 text-gray-600 leading-relaxed">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-gray-900">
                {section.title}
              </h2>
              <div className="mt-2 space-y-2">{section.content}</div>
            </section>
          ))}
        </div>

        {relatedLinks && relatedLinks.length > 0 && (
          <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-sm font-bold text-gray-900">Related policies</h2>
            <ul className="mt-3 space-y-2">
              {relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-600 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-8 text-sm text-gray-500">
          Questions? Contact{" "}
          <a
            href="mailto:support@zimhub.co.zw"
            className="text-brand-600 hover:underline"
          >
            support@zimhub.co.zw
          </a>{" "}
          or reach us via WhatsApp support on the site.
        </p>
      </div>
    </div>
  );
}
