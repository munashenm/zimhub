export const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/buyer-terms", label: "Buyer Terms" },
  { href: "/seller-terms", label: "Seller Terms" },
] as const;

export const RELATED_LEGAL = (current: string) =>
  LEGAL_LINKS.filter((link) => link.href !== current);
