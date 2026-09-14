"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/lib/auth";
import { GoogleButton } from "./GoogleButton";
import { AuthDivider } from "./AuthDivider";
import { PasswordField } from "./PasswordField";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/utils";
import { TurnstileWidget } from "./TurnstileWidget";
import { trackMetaEvent } from "@/lib/analytics/meta";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Please enter a valid email address"),
    mobile: z
      .string()
      .min(1, "Mobile number is required")
      .refine((val) => /^(\+?8801|01)[0-9]{9}$/.test(val.replace(/[\s-]/g, "")), "Enter a valid Bangladeshi mobile number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormInput = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [duplicateEmail, setDuplicateEmail] = useState<string | null>(null);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [pendingData, setPendingData] = useState<RegisterFormInput | null>(null);
  const [retrySeconds, setRetrySeconds] = useState(0);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [signupStarted, setSignupStarted] = useState(false);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (retrySeconds <= 0) return;
    const timer = window.setInterval(() => setRetrySeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [retrySeconds]);

  const onSubmit = async (data: RegisterFormInput, token = captchaToken) => {
    if (!signupStarted) {
      setSignupStarted(true);
      trackMetaEvent("SignUp");
    }
    setIsLoading(true);
    setDuplicateEmail(null);
    try {
      await AuthService.register({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        ...(token ? { captchaToken: token } : {}),
      } as RegisterFormInput);
      setRegistrationSuccess(true);
      setRegisteredEmail(data.email);
      trackMetaEvent("CompleteRegistration", { status: "submitted" });
      toast.success("Account created! Check your email to verify.");
    } catch (error: unknown) {
      const status = getApiErrorStatus(error);
      const message = getApiErrorMessage(error, "Registration failed.");
      const responseData = (error as { response?: { data?: { captchaRequired?: boolean; retryAfterSeconds?: number } } }).response?.data;

      if (status === 409) {
        setDuplicateEmail(data.email);
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
  const handleFormSubmit = (data: RegisterFormInput) => { void onSubmit(data); };

  const handleResend = async () => {
    try {
      await AuthService.resendVerification(registeredEmail);
      toast.success("Verification email sent!");
    } catch {
      toast.error("Failed to resend.");
    }
  };

  // Duplicate email state
  if (duplicateEmail) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Account Already Exists</h2>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
          An account with <span className="font-medium text-slate-700">{duplicateEmail}</span> already exists. Please sign in instead.
        </p>
        <div className="space-y-3">
          <Link href="/login" className="block">
            <Button variant="primary" size="lg" className="w-full">
              Go to Sign In
            </Button>
          </Link>
          <Button variant="ghost" size="md" className="w-full" onClick={() => setDuplicateEmail(null)}>
            Try Different Email
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  if (registrationSuccess) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-5">
          <MailCheck className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Check Your Email</h2>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
          We sent a verification link to <span className="font-medium text-slate-700">{registeredEmail}</span>. Click the link to activate your account.
        </p>
        <div className="space-y-3">
          <Button variant="primary" size="lg" className="w-full" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={handleResend}>
            Resend Email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        id="reg-name"
        type="text"
        label="Full Name"
        placeholder="Your full name"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        id="reg-email"
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        id="reg-mobile"
        type="tel"
        label="Mobile Number"
        placeholder="01711111111"
        autoComplete="tel"
        error={errors.mobile?.message}
        {...register("mobile")}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <PasswordField
            id="reg-password"
            label="Password"
            placeholder="Create a strong password"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.password?.message}
            showRequirements
            autoComplete="new-password"
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <PasswordField
            id="reg-confirm"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
          />
        )}
      />

      {captchaRequired && (
        <TurnstileWidget key={captchaResetKey} onVerify={handleCaptchaVerify} onExpire={() => setCaptchaToken(null)} onError={() => { setCaptchaToken(null); toast.error("Security check failed. Please try again."); }} />
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={isLoading} disabled={retrySeconds > 0}>
        {isLoading ? "Creating account..." : retrySeconds > 0 ? `Try again in ${retryLabel}` : "Create Account"}
      </Button>

      <AuthDivider />

      <GoogleButton />

      <p className="text-center text-sm text-slate-500 pt-2">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}