"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, MailCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";
import { GoogleButton } from "./GoogleButton";
import { AuthDivider } from "./AuthDivider";
import { PasswordField } from "./PasswordField";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormInput = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
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

  const onSubmit = async (data: LoginFormInput) => {
    setIsLoading(true);
    setUnverifiedEmail(null);
    try {
      const response = await AuthService.login(data);
      if (response.data.accessToken) {
        login(response.data.user, response.data.accessToken);
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "Login failed.";

      if (status === 403 && message.toLowerCase().includes("verif")) {
        // Email not verified
        setUnverifiedEmail(data.email);
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!unverifiedEmail) return;
    setResending(true);
    try {
      await AuthService.resendVerification(unverifiedEmail);
      toast.success("Verification email sent! Check your inbox.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend.");
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
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