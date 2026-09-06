export type AccountRole = "BUYER" | "SELLER" | "ADMIN";

export function isSafeCallbackUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  if (!url.startsWith("/")) return false;
  if (url.startsWith("//") || url.startsWith("/\\")) return false;
  if (url.startsWith("/login") || url.startsWith("/register")) return false;
  return true;
}

function callbackAllowedForRole(role: string, callbackUrl: string): boolean {
  if (callbackUrl.startsWith("/admin") && role !== "ADMIN") return false;
  if (callbackUrl.startsWith("/seller") && role !== "SELLER" && role !== "ADMIN") {
    return false;
  }
  return true;
}

/** Where to send the user after a successful sign-in. */
export function postLoginPath(role: string, callbackUrl?: string | null): string {
  if (
    isSafeCallbackUrl(callbackUrl) &&
    callbackUrl !== "/" &&
    callbackAllowedForRole(role, callbackUrl)
  ) {
    return callbackUrl;
  }
  if (role === "ADMIN") return "/admin";
  if (role === "SELLER") return "/seller";
  return "/dashboard";
}

export function loginRoleMismatch(
  expected: "BUYER" | "SELLER" | undefined,
  actual: string
): string | null {
  if (!expected) return null;
  if (actual === "ADMIN") return null;
  if (expected === "SELLER" && actual !== "SELLER") {
    return "This email is a buyer account. Use buyer login instead.";
  }
  if (expected === "BUYER" && actual === "SELLER") {
    return "This email is a seller account. Use seller login instead.";
  }
  return null;
}
