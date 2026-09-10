"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, MailCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthService } from "@/lib/auth";
import { getApiErrorMessage } from "@/lib/utils";

const resendSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResendInput = z.infer<typeof resendSchema>;

export default function ResendVerificationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendInput>({
    resolver: zodResolver(resendSchema),
  });

  const onSubmit = async (data: ResendInput) => {
    setIsLoading(true);

    try {
      await AuthService.resendVerification(data.email);
      setSent(true);
      toast.success("Verification email sent! Check your inbox.");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to send verification email."));
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthCard title="Email Sent!" subtitle="Check your inbox for the verification link">
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6">
            <MailCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            If an unverified account exists with that email, you will receive a verification link shortly.
          </p>
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setSent(false)}
            >
              Send Again
            </Button>
            <Link href="/login" className="block">
              <Button variant="outline" size="lg" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Resend Verification"
      subtitle="Enter your email to receive a new verification link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="resend-email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <MailCheck className="w-4 h-4 mr-2" />
              Send Verification Email
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        Remember your password?{" "}
        <Link
          href="/login"
          className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}