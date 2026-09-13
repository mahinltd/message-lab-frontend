"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AccountService } from "@/lib/account";
import { useAuthStore } from "@/stores/authStore";

function EmailChangeContent() {
  const searchParams = useSearchParams();
  const { updateUser } = useAuthStore();
  const token = searchParams.get("token");
  const [message, setMessage] = useState(token ? "Confirming your email address..." : "This email confirmation link is incomplete.");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    AccountService.confirmEmailChange(token)
      .then((data) => {
        updateUser({ email: data.email, isEmailVerified: true });
        setSuccess(true);
        setMessage("Your email address has been updated.");
      })
      .catch(() => setMessage("This email confirmation link is invalid or expired."));
  }, [token, updateUser]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <p className={`text-sm font-semibold ${success ? "text-green-600" : "text-slate-600"}`}>{message}</p>
        <Link href="/dashboard/settings" className="mt-6 inline-block text-sm font-semibold text-indigo-600 hover:underline">
          Return to settings
        </Link>
      </div>
    </main>
  );
}

export default function EmailChangePage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center px-6 text-center">Confirming your email address...</main>}>
      <EmailChangeContent />
    </Suspense>
  );
}