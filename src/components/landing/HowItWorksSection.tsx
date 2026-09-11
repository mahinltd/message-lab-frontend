"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserPlus, Download, Link2, Send } from "lucide-react";
import type { PageContent } from "@/types";

const steps = [
  { icon: UserPlus, title: "Create an Account", desc: "Sign up for free and verify your email address." },
  { icon: Download, title: "Install the App", desc: "Download the Messages Lab Android app and grant permissions." },
  { icon: Link2, title: "Connect Device", desc: "Scan the QR code or enter the pairing code to connect." },
  { icon: Send, title: "Start Sending", desc: "Use the web dashboard to send SMS through your device." },
];

export function HowItWorksSection({ content }: { content: PageContent }) {
  const sectionTitle = content.pages.how_it_works_title?.title || "Get Started in 4 Simple Steps";
  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {sectionTitle}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-slate-200" />
              )}
              <div className="relative inline-flex">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-indigo-500 text-indigo-600 text-xs font-bold flex items-center justify-center shadow-sm">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}