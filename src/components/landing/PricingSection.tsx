"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/stores/contentStore";

export function PricingSection() {
  const { content, isLoading, fetchContent } = useContentStore();

  useEffect(() => {
    if (!content) fetchContent();
  }, [content, fetchContent]);

  if (isLoading && !content) {
    return (
      <section className="section-padding">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
      </section>
    );
  }

  const plans = content?.pricing?.plans || [];
  const note = content?.pricing?.sectionContent?.pricing_section_note?.body || "";

  return (
    <section id="pricing" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Choose Your <span className="gradient-text">Plan</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Start free and upgrade as you grow. All plans use your own SIM card.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.planId}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative flex flex-col rounded-2xl bg-white p-8 ${
                plan.planId === "pro"
                  ? "border-2 border-indigo-600 shadow-xl shadow-indigo-200/50 lg:-my-4"
                  : "border border-slate-200 shadow-sm"
              }`}
            >
              {plan.planId === "pro" && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-md">
                    <Star className="w-3 h-3 fill-current" /> Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-lg font-bold text-slate-900">{plan.displayName}</h3>
              {plan.description && (
                <p className="mt-1.5 text-sm text-slate-600">{plan.description}</p>
              )}

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-sm text-slate-500">৳</span>
                <span className="text-4xl font-extrabold text-slate-900">{plan.priceMonthly}</span>
                <span className="text-slate-500 text-sm">/month</span>
              </div>

              <ul className="mt-8 space-y-3 flex-1">
                {plan.features.map((f: string) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </span>
                    <span className="text-sm text-slate-700">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link href="/register" className="block">
                  <Button
                    variant={plan.planId === "pro" ? "primary" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    {plan.priceMonthly === 0 ? "Get Started Free" : `Get ${plan.displayName}`}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {note && <p className="text-center text-sm text-slate-500 mt-10">{note}</p>}
      </div>
    </section>
  );
}