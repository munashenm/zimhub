"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  Heart,
  ChevronDown,
  LogOut,
  Store,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { TopBar } from "./TopBar";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/utils";

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();

  const dashboardLink =
    session?.user.role === "ADMIN"
      ? "/admin"
      : session?.user.role === "SELLER"
        ? "/seller"
        : "/dashboard";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (category) params.set("category", category);
    router.push(`/search?${params.toString()}`);
    setMobileOpen(false);
  };

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="container-app">
          <div className="flex h-[72px] items-center gap-4">
            <Logo className="hidden sm:flex" />

            <form onSubmit={handleSearch} className="hidden flex-1 md:flex">
              <div className="flex w-full overflow-hidden rounded-full border border-gray-300">
                <input
                  type="search"
                  placeholder="Search for anything"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-w-0 flex-1 px-4 py-2.5 text-sm focus:outline-none"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="hidden border-l border-gray-300 bg-white px-3 text-sm text-gray-600 focus:outline-none lg:block"
                >
                  <option value="">All categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="flex items-center justify-center bg-brand-500 px-5 text-white hover:bg-brand-600"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="relative hidden md:block">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2 rounded-full border-2 border-brand-500 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
                >
                  <User className="h-4 w-4" />
                  {session ? session.user.name?.split(" ")[0] : "My account"}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {session ? (
                      <>
                        <Link
                          href={dashboardLink}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setAccountOpen(false)}
                        >
                          {session.user.role === "ADMIN" ? (
                            <Shield className="h-4 w-4" />
                          ) : session.user.role === "SELLER" ? (
                            <Store className="h-4 w-4" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                          Dashboard
                        </Link>
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setAccountOpen(false)}>
                          Log in
                        </Link>
                        <Link href="/register" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setAccountOpen(false)}>
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link href="/dashboard" className="hidden rounded-full p-2.5 text-gray-500 hover:bg-gray-100 md:flex">
                <Heart className="h-5 w-5" />
              </Link>

              <Link
                href="/cart"
                className="flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-lg p-2 text-gray-600 md:hidden"
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile logo row */}
          <div className="pb-3 sm:hidden">
            <Logo />
          </div>

          {mobileOpen && (
            <div className="border-t border-gray-100 py-4 md:hidden">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="flex overflow-hidden rounded-full border border-gray-300">
                  <input
                    type="search"
                    placeholder="Search for anything"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="min-w-0 flex-1 px-4 py-2.5 text-sm"
                  />
                  <button type="submit" className="bg-brand-500 px-4 text-white">
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </form>
              <nav className="flex flex-col gap-1">
                {session ? (
                  <>
                    <Link href={dashboardLink} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                      Dashboard
                    </Link>
                    <Link href="/cart" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                      Cart
                    </Link>
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-lg px-3 py-2.5 text-left text-sm hover:bg-gray-100">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                      Log in
                    </Link>
                    <Link href="/register" className="rounded-lg bg-brand-500 px-3 py-2.5 text-sm font-semibold text-white" onClick={() => setMobileOpen(false)}>
                      Register
                    </Link>
                  </>
                )}
                <Link href="/register?seller=true" className="mt-2 rounded-lg border border-brand-500 px-3 py-2.5 text-center text-sm font-semibold text-brand-600" onClick={() => setMobileOpen(false)}>
                  Sell on ZimHub
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
