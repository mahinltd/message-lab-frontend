"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MailCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";
import { GoogleButton } from "./GoogleButton";
import { AuthDivider } from "./AuthDivider";
import { PasswordField } from "./PasswordField";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/utils";
import { TurnstileWidget } from "./TurnstileWidget";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormInput = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [pendingData, setPendingData] = useState<LoginFormInput | null>(null);
  const [retrySeconds, setRetrySeconds] = useState(0);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const { login } = useAuthStore();
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (retrySeconds <= 0) return;
    const timer = window.setInterval(() => setRetrySeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [retrySeconds]);

  const onSubmit = async (data: LoginFormInput, token = captchaToken) => {
    setIsLoading(true);
    setUnverifiedEmail(null);
    try {
      const response = await AuthService.login({ ...data, ...(token ? { captchaToken: token } : {}) } as LoginFormInput);
      if (response.data.accessToken) {
        login(response.data.user, response.data.accessToken);
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      const status = getApiErrorStatus(error);
      const message = getApiErrorMessage(error, "Login failed.");
      const responseData = (error as { response?: { data?: { captchaRequired?: boolean; retryAfterSeconds?: number } } }).response?.data;

      if (status === 403 && message.toLowerCase().includes("verif")) {
        // Email not verified
        setUnverifiedEmail(data.email);
      } else if (status === 428 || responseData?.captchaRequired) {
        setCaptchaRequired(true);
        setPendingData(data);
        setCaptchaToken(null);
        setCaptchaResetKey((key) => key + 1);
      } else if (status === 429) {
        const seconds = responseData?.retryAfterSeconds || 30;
        setRetrySeconds(seconds);
        toast.error(`Too many attempts — try again in ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`);
      } else if ((error as { flag?: string }).flag === "transient" || !status || status >= 500) {
        toast.error("Connection issue. Please try again.");
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptchaVerify = (token: string | null) => {
    setCaptchaToken(token);
    if (token && pendingData) {
      const nextData = pendingData;
      setPendingData(null);
      void onSubmit(nextData, token);
    }
  };
  const retryLabel = `${Math.floor(retrySeconds / 60)}:${String(retrySeconds % 60).padStart(2, "0")}`;
  const handleFormSubmit = (data: LoginFormInput) => { void onSubmit(data); };

  const handleResend = async () => {
    if (!unverifiedEmail) return;
    setResending(true);
    try {
      await AuthService.resendVerification(unverifiedEmail);
      toast.success("Verification email sent! Check your inbox.");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to resend."));
    } finally {
      setResending(false);
    }
  };

  // Unverified state
  if (unverifiedEmail) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-5">
          <AlertTriangle className="w-7 h-7 text-amber-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Email Not Verified
        </h2>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
          Please verify <span className="font-medium text-slate-700">{unverifiedEmail}</span> before signing in. Check your inbox for the verification link.
        </p>
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleResend}
            isLoading={resending}
          >
            <MailCheck className="w-4 h-4 mr-2" />
            Resend Verification Email
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="w-full"
            onClick={() => setUnverifiedEmail(null)}
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <Input
        id="login-email"
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <PasswordField
            id="login-password"
            label="Password"
            placeholder="Enter your password"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.password?.message}
            autoComplete="current-password"
          />
        )}
      />

      <div className="flex justify-end -mt-2">
        <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline font-medium">
          Forgot password?
        </Link>
      </div>

      {captchaRequired && (
        <TurnstileWidget key={captchaResetKey} onVerify={handleCaptchaVerify} onExpire={() => setCaptchaToken(null)} onError={() => { setCaptchaToken(null); toast.error("Security check failed. Please try again."); }} />
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading} disabled={retrySeconds > 0}>
        {isLoading ? "Signing in..." : retrySeconds > 0 ? `Try again in ${retryLabel}` : "Sign In"}
      </Button>

      <AuthDivider />

      <GoogleButton />

      <p className="text-center text-sm text-slate-500 pt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
          Create free account
        </Link>
      </p>
    </form>
  );
}