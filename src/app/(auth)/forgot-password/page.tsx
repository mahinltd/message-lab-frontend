"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MailCheck, ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/lib/auth";
import { getApiErrorMessage } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormInput = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormInput) => {
    setIsLoading(true);
    try {
      await AuthService.forgotPassword(data.email);
      setSent(true);
      toast.success("Reset link sent! Check your inbox.");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to send reset link."));
    } finally {
      setIsLoading(false);
    }
  };

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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="fp-email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
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