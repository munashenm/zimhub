"use client";

import { useEffect, useState } from "react";
import { signIn, getSession, signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginRoleMismatch, postLoginPath } from "@/lib/auth-redirect";

export function LoginForm() {
  const searchParams = useSearchParams();
  const { data: existingSession, status } = useSession();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const initialRole = searchParams.get("role") === "seller" ? "SELLER" : "BUYER";
  const [portal, setPortal] = useState<"BUYER" | "SELLER">(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !existingSession?.user?.role) return;
    window.location.replace(postLoginPath(existingSession.user.role, callbackUrl));
  }, [status, existingSession, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setError("Invalid email or password");
      return;
    }

    let session = await getSession();
    if (!session?.user) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      session = await getSession();
    }
    const role = session?.user?.role;
    if (!role) {
      setLoading(false);
      setError("Signed in, but we could not load your account. Try again.");
      return;
    }

    const mismatch = loginRoleMismatch(portal, role);
    if (mismatch) {
      await signOut({ redirect: false });
      setLoading(false);
      setError(mismatch);
      return;
    }

    window.location.assign(postLoginPath(role, callbackUrl));
  };

  if (status === "authenticated" && existingSession?.user?.role) {
    return (
      <div className="container-app flex min-h-[70vh] items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">You&apos;re already signed in</h1>
          <p className="mt-2 text-sm text-gray-500">
            Continuing to your {existingSession.user.role === "SELLER" ? "seller" : "account"} dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            {portal === "SELLER" ? "Seller login" : "Buyer login"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {portal === "SELLER"
              ? "Sign in to manage listings, orders, and payouts"
              : "Sign in to buy, track orders, and make offers"}
          </p>

          <div className="mt-5 grid grid-cols-2 rounded-lg border border-gray-200 p-1">
            <button
              type="button"
              onClick={() => {
                setPortal("BUYER");
                setError("");
              }}
              className={`rounded-md py-2 text-sm font-medium ${
                portal === "BUYER" ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => {
                setPortal("SELLER");
                setError("");
              }}
              className={`rounded-md py-2 text-sm font-medium ${
                portal === "SELLER" ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Seller
            </button>
          </div>

          <form id="login-form" onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <Button type="submit" className="w-full" loading={loading}>
              {portal === "SELLER" ? "Sign in as seller" : "Sign in as buyer"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href={portal === "SELLER" ? "/register?seller=true" : "/register"}
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              {portal === "SELLER" ? "Register as a seller" : "Register as a buyer"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
