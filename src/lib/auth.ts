import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import {
  ensureAuthEnv,
  getAuthCookieDomain,
  getAuthSecret,
  useSecureAuthCookies,
} from "./auth-env";

ensureAuthEnv();

const useSecureCookies = useSecureAuthCookies();
const cookieDomain = getAuthCookieDomain();

export const authOptions: NextAuthOptions = {
  secret: getAuthSecret(),
  useSecureCookies,
  cookies: {
    sessionToken: {
      name: useSecureCookies
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        ...(cookieDomain ? { domain: cookieDomain } : {}),
      },
    },
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { sellerProfile: true },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          sellerProfileId: user.sellerProfile?.id ?? null,
          verificationStatus: user.sellerProfile?.verificationStatus ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.sellerProfileId = user.sellerProfileId;
        token.verificationStatus = user.verificationStatus;
        token.verificationCheckedAt = Date.now();
      }

      // Keep seller verification in sync after an admin approves/rejects.
      const lastCheck = typeof token.verificationCheckedAt === "number" ? token.verificationCheckedAt : 0;
      const shouldRefreshSeller =
        token.role === "SELLER" && token.id && Date.now() - lastCheck > 15_000;

      if (shouldRefreshSeller) {
        try {
          const profile = await prisma.sellerProfile.findUnique({
            where: { userId: token.id as string },
            select: { id: true, verificationStatus: true },
          });
          token.sellerProfileId = profile?.id ?? null;
          token.verificationStatus = profile?.verificationStatus ?? null;
          token.verificationCheckedAt = Date.now();
        } catch {
          // Session still works if the DB blip is temporary.
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.sellerProfileId = token.sellerProfileId as string | null;
        session.user.verificationStatus = token.verificationStatus as string | null;
      }
      return session;
    },
  },
};
