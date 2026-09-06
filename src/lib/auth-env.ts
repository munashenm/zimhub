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
