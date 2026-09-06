/** Cookie names NextAuth v4 may set, depending on HTTPS and host. */
export const NEXTAUTH_SESSION_COOKIE_NAMES = [
  "__Secure-next-auth.session-token",
  "__Host-next-auth.session-token",
  "next-auth.session-token",
] as const;

export type SessionCookieName = (typeof NEXTAUTH_SESSION_COOKIE_NAMES)[number];

function cookieValueFromHeader(header: string | null | undefined, name: string): string | undefined {
  if (!header) return undefined;
  const parts = header.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf("=");
    const key = eq === -1 ? trimmed : trimmed.slice(0, eq);
    if (key === name) {
      const value = eq === -1 ? "" : trimmed.slice(eq + 1);
      return value || undefined;
    }
  }
  return undefined;
}

/** Find whichever NextAuth session cookie is actually on the request. */
export function findSessionCookieName(
  cookies: {
    get: (name: string) => { value: string } | undefined;
  },
  cookieHeader?: string | null
): SessionCookieName | undefined {
  for (const name of NEXTAUTH_SESSION_COOKIE_NAMES) {
    const value = cookies.get(name)?.value || cookieValueFromHeader(cookieHeader, name);
    if (value) return name;
  }
  return undefined;
}
