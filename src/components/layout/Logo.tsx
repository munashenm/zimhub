import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex shrink-0 items-center gap-2 ${className}`}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="18" cy="18" r="18" fill="#16a34a" />
        <path
          d="M12 22c0-3.3 2.7-8 6-8s6 4.7 6 8"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="14" cy="14" r="2" fill="white" />
        <circle cx="22" cy="14" r="2" fill="white" />
      </svg>
      <span className="text-2xl font-bold tracking-tight">
        <span className="text-brand-600">zim</span>
        <span className="text-bob-navy">hub</span>
      </span>
    </Link>
  );
}
