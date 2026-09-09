"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/lib/auth";

type Status = "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing. Please check your email link.");
        return;
      }
      try {
        const res = await AuthService.verifyEmail(token);
        setStatus("success");
        setMessage(res.message || "Email verified successfully!");
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || "Verification failed. The link may have expired."
        );
      }
    }
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center mb-5">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Verifying Your Email</h2>
              <p className="text-sm text-slate-500">Please wait while we verify your address...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Email Verified!</h2>
              <p className="text-sm text-slate-500 mb-6">{message}</p>
              <Link href="/login" className="block">
                <Button variant="primary" size="lg" className="w-full">
                  Continue to Login
                </Button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-5">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Verification Failed</h2>
              <p className="text-sm text-slate-500 mb-6">{message}</p>
              <div className="space-y-3">
                <Link href="/login" className="block">
                  <Button variant="primary" size="lg" className="w-full">Back to Login</Button>
                </Link>
                <Link href="/resend-verification" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    <MailCheck className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}