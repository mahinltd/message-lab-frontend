"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-[440px] mx-auto"
    >
      {/* Logo — always visible on any background */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-300">
            <MessageSquare className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="text-[22px] font-bold tracking-tight text-gray-900 dark:text-white">
            Messages<span className="text-indigo-600 dark:text-indigo-400">Lab</span>
          </span>
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/20 p-8 sm:p-10">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6 leading-relaxed">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="text-indigo-500 hover:text-indigo-600 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-indigo-500 hover:text-indigo-600 hover:underline">
          Privacy Policy
        </Link>
      </p>
    </motion.div>
  );
}