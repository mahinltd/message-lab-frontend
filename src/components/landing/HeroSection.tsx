"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMockup } from "./DashboardMockup";
import type { PageContent } from "@/types";

export function HeroSection({ content }: { content: PageContent }) {

  const badge = content?.hero?.hero_badge?.title || "Your Phone. Your SIM. Your Gateway.";
  const title = content?.hero?.hero_title?.title || "Turn Your Android Into a Personal SMS Gateway";
  const subtitle = content?.hero?.hero_subtitle?.body || "Send, receive, and manage SMS through your own device using the MessageLab platform.";
  const ctaPrimary = content?.hero?.hero_cta_primary?.title || "Get Started Free";
  const ctaPrimaryLink = content?.hero?.hero_cta_primary?.body || "/register";
  const ctaSecondary = content?.hero?.hero_cta_secondary?.title || "View Pricing";
  const configuredSecondaryLink = content?.hero?.hero_cta_secondary?.body;
  const ctaSecondaryLink = configuredSecondaryLink === "/pricing" ? "/#pricing" : configuredSecondaryLink || "/#pricing";

  // Split title to gradient the last part
  const words = title.split(" ");
  const head = words.slice(0, -3).join(" ");
  const tail = words.slice(-3).join(" ");

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Soft top gradient */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-indigo-50/70 via-white to-white -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered hero copy */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-indigo-700">{badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight"
          >
            {head} <span className="gradient-text">{tail}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-slate-600 leading-relaxed"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href={ctaPrimaryLink}>
              <Button variant="primary" size="lg" className="gap-2 group shadow-lg shadow-indigo-500/25">
                {ctaPrimary}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href={ctaSecondaryLink}>
              <Button variant="outline" size="lg">{ctaSecondary}</Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-600"
          >
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-green-600" /> End-to-End Secure</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Instant Setup</span>
          </motion.div>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-16"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}