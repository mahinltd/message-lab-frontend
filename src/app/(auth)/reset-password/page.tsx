"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/auth/PasswordField";
import { AuthService } from "@/lib/auth";
import { getApiErrorMessage } from "@/lib/utils";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset token is missing.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.resetPassword(token, password);
      setDone(true);
      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/login"), 1800);
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "Failed to reset password."));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthCard title="Invalid Link" subtitle="This reset link is not valid">
        <div className="text-center py-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-5">
            <XCircle className="w-7 h-7 text-red-600" />
          </div>
          <p className="text-sm text-slate-500 mb-6">
            The reset link is missing a token. Please request a new one.
          </p>
          <Link href="/forgot-password" className="block">
            <Button variant="primary" size="lg" className="w-full">
              Request New Link
            </Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  if (done) {
    return (
      <AuthCard title="Password Reset" subtitle="Your password has been changed">
        <div className="text-center py-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
          </div>
          <p className="text-sm text-slate-500">Redirecting you to login...</p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set New Password"
      subtitle="Choose a strong password for your account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField
          id="rp-password"
          label="New Password"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showRequirements
          autoComplete="new-password"
        />
        <PasswordField
          id="rp-confirm"
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={error && password !== confirm ? "Passwords do not match" : undefined}
          autoComplete="new-password"
        />

        {error && password === confirm && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
          disabled={!password || !confirm}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}