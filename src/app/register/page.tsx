"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSeller = searchParams.get("seller") === "true";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: isSeller ? "SELLER" : "BUYER",
    businessName: "",
    businessDescription: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (signInResult?.error) {
      router.push("/login");
      return;
    }

    router.push(form.role === "SELLER" ? "/seller" : "/dashboard");
    router.refresh();
  };

  return (
    <div className="container-app py-12">
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            {isSeller ? "Register as Seller" : "Create Account"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isSeller
              ? "Start selling on Zimbabwe's trusted marketplace"
              : "Join ZimHub to buy safely across Zimbabwe"}
          </p>

          {!isSeller && (
            <div className="mt-4 flex rounded-lg border border-gray-200 p-1">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "BUYER" })}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  form.role === "BUYER"
                    ? "bg-brand-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "SELLER" })}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  form.role === "SELLER"
                    ? "bg-brand-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Seller
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+263 77 123 4567" />
            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />

            {form.role === "SELLER" && (
              <>
                <Input label="Business Name" name="businessName" value={form.businessName} onChange={handleChange} required />
                <Textarea label="Business Description" name="businessDescription" value={form.businessDescription} onChange={handleChange} rows={3} />
                <Input label="Location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Harare, Avondale" />
              </>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              {form.role === "SELLER" ? "Register as Seller" : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
