"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  Store,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { TopBar } from "./TopBar";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";

export function Header() {
  const { data: session, status } = useSession();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();
  const accountRef = useRef<HTMLDivElement>(null);

  const dashboardLink =
    session?.user.role === "ADMIN"
      ? "/admin"
      : session?.user.role === "SELLER"
        ? "/seller"
        : "/dashboard";

  const dashboardLabel =
    session?.user.role === "ADMIN"
      ? "Admin dashboard"
      : session?.user.role === "SELLER"
        ? "Seller dashboard"
        : "My dashboard";

  const handleSignOut = () => {
    setAccountOpen(false);
    setMobileOpen(false);
    void signOut({ callbackUrl: "/", redirect: true });
  };

  useEffect(() => {
    if (!accountOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [accountOpen]);

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
          <div className="flex h-[64px] items-center gap-3 sm:h-[72px] sm:gap-4">
            <Logo />

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
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="relative hidden md:block" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2 rounded-full border-2 border-brand-500 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
                >
                  <User className="h-4 w-4" />
                  {status === "authenticated" && session
                    ? session.user.name?.split(" ")[0]
                    : "My account"}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {status === "authenticated" && session ? (
                      <>
                        <a
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
                          {dashboardLabel}
                        </a>
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setAccountOpen(false)}>
                          Buyer login
                        </Link>
                        <Link href="/login?role=seller" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setAccountOpen(false)}>
                          Seller login
                        </Link>
                        <Link href="/register" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setAccountOpen(false)}>
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link
                href="/cart"
                className="relative flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-bob-navy px-1 text-[10px] font-bold text-white">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-lg p-2 text-gray-600 md:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="pb-3 md:hidden">
            <div className="flex overflow-hidden rounded-full border border-gray-300">
              <input
                type="search"
                placeholder="Search for anything"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-0 flex-1 px-4 py-2.5 text-sm"
              />
              <button type="submit" className="bg-brand-500 px-4 text-white" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {mobileOpen && (
            <div className="border-t border-gray-100 py-4 md:hidden">
              <nav className="flex flex-col gap-1">
                {session ? (
                  <>
                    <a href={dashboardLink} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                      {dashboardLabel}
                    </a>
                    <Link href="/cart" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                      Cart{itemCount > 0 ? ` (${itemCount})` : ""}
                    </Link>
                    <button onClick={handleSignOut} className="rounded-lg px-3 py-2.5 text-left text-sm hover:bg-gray-100">
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                      Buyer login
                    </Link>
                    <Link href="/login?role=seller" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                      Seller login
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
