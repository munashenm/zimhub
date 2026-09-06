/** Align NextAuth env names used by Railway / Auth.js with next-auth v4. */
export function ensureAuthEnv() {
  if (!process.env.NEXTAUTH_SECRET && process.env.AUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = process.env.AUTH_SECRET;
  }

  if (!process.env.NEXTAUTH_URL) {
    if (process.env.AUTH_URL) {
      process.env.NEXTAUTH_URL = process.env.AUTH_URL;
    } else if (process.env.RAILWAY_PUBLIC_DOMAIN) {
      process.env.NEXTAUTH_URL = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
    }
  }
}

export function getAuthSecret() {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
}

export function getAuthPublicUrl() {
  return process.env.NEXTAUTH_URL || process.env.AUTH_URL || "";
}

export function shouldUseSecureAuthCookies() {
  if (process.env.NODE_ENV === "production") return true;
  return getAuthPublicUrl().startsWith("https://");
}

/** Send zimhub.co.zw ↔ www.zimhub.co.zw to the host in NEXTAUTH_URL. */
export function canonicalZimhubHost(
  requestHost: string,
  canonicalUrl: string
): string | null {
  let want: string;
  try {
    want = new URL(canonicalUrl).hostname.toLowerCase();
  } catch {
    return null;
  }
  const got = requestHost.split(":")[0].toLowerCase();
  if (!got || got === want) return null;
  const isZimhub = (host: string) => host === "zimhub.co.zw" || host === "www.zimhub.co.zw";
  if (!isZimhub(got) || !isZimhub(want)) return null;
  return want;
}

export function cookieDomainForAuthUrl(url: string, override?: string): string | undefined {
  if (override) return override;
  try {
    const host = new URL(url).hostname;
    if (host === "zimhub.co.zw" || host.endsWith(".zimhub.co.zw")) {
      return ".zimhub.co.zw";
    }
  } catch {
    // Local or invalid NEXTAUTH_URL — host-only cookies.
  }
  return undefined;
}

/** Share the session cookie across apex and www in production. */
export function getAuthCookieDomain(): string | undefined {
  return cookieDomainForAuthUrl(getAuthPublicUrl(), process.env.NEXTAUTH_COOKIE_DOMAIN);
}
