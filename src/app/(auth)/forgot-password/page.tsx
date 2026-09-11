"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MailCheck, ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/utils";
import { getApiErrorStatus } from "@/lib/utils";
import { api } from "@/lib/api";
import { TurnstileWidget } from "@/components/auth/TurnstileWidget";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormInput = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [retrySeconds, setRetrySeconds] = useState(0);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (retrySeconds <= 0) return;
    const timer = window.setInterval(() => setRetrySeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [retrySeconds]);

  const onSubmit = async (data: FormInput, token = captchaToken) => {
    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: data.email, ...(token ? { captchaToken: token } : {}) });
      setSent(true);
      toast.success("Reset link sent! Check your inbox.");
    } catch (error: unknown) {
      const status = getApiErrorStatus(error);
      const responseData = (error as { response?: { data?: { captchaRequired?: boolean; retryAfterSeconds?: number } } }).response?.data;
      if (status === 428 || responseData?.captchaRequired) {
        setCaptchaRequired(true);
        setPendingEmail(data.email);
        setCaptchaToken(null);
        setCaptchaResetKey((key) => key + 1);
      } else if (status === 429) {
        const seconds = responseData?.retryAfterSeconds || 30;
        setRetrySeconds(seconds);
        toast.error(`Too many attempts — try again in ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`);
      } else if ((error as { flag?: string }).flag === "transient" || !status || status >= 500) {
        toast.error("Connection issue. Please try again.");
      } else {
        toast.error(getApiErrorMessage(error, "Failed to send reset link."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptchaVerify = (token: string | null) => {
    setCaptchaToken(token);
    if (token && pendingEmail) {
      const email = pendingEmail;
      setPendingEmail(null);
      void onSubmit({ email }, token);
    }
  };
  const retryLabel = `${Math.floor(retrySeconds / 60)}:${String(retrySeconds % 60).padStart(2, "0")}`;
  const handleFormSubmit = (data: FormInput) => { void onSubmit(data); };

  if (sent) {
    return (
      <AuthCard title="Check Your Email" subtitle="We sent you a password reset link">
        <div className="text-center py-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-5">
            <MailCheck className="w-7 h-7 text-green-600" />
          </div>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            If an account exists with that email, you will receive a reset link
            shortly. The link expires in 30 minutes.
          </p>
          <Link href="/login" className="block">
            <Button variant="primary" size="lg" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <Input
          id="fp-email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        {captchaRequired && (
          <TurnstileWidget key={captchaResetKey} onVerify={handleCaptchaVerify} onExpire={() => setCaptchaToken(null)} onError={() => { setCaptchaToken(null); toast.error("Security check failed. Please try again."); }} />
        )}
        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading} disabled={retrySeconds > 0}>
          {isLoading ? "Sending..." : retrySeconds > 0 ? `Try again in ${retryLabel}` : "Send Reset Link"}
        </Button>
      </form>
      <p className="text-center text-sm text-slate-500 mt-5">
        Remember your password?{" "}
        <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}