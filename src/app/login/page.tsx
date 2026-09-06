import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { postLoginPath } from "@/lib/auth-redirect";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; role?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  if (session?.user?.role) {
    redirect(postLoginPath(session.user.role, params.callbackUrl));
  }

  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
