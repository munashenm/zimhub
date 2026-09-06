/** Cookie names NextAuth v4 may set, depending on HTTPS and host. */
export const NEXTAUTH_SESSION_COOKIE_NAMES = [
  "__Secure-next-auth.session-token",
  "__Host-next-auth.session-token",
  "next-auth.session-token",
] as const;

export type SessionCookieName = (typeof NEXTAUTH_SESSION_COOKIE_NAMES)[number];

/** Find whichever NextAuth session cookie is actually on the request. */
export function findSessionCookieName(cookies: {
  get: (name: string) => { value: string } | undefined;
}): SessionCookieName | undefined {
  for (const name of NEXTAUTH_SESSION_COOKIE_NAMES) {
    const value = cookies.get(name)?.value;
    if (value) return name;
  }
  return undefined;
}
