"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, Globe, LayoutDashboard, Users, Shield, Eye } from "lucide-react";
import type { PageContent } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  smartphone: Smartphone,
  "sim-card": Globe,
  dashboard: LayoutDashboard,
  bulk: Users,
  shield: Shield,
  eye: Eye,
};

export function FeaturesSection({ content }: { content: PageContent }) {
  const features = [...(content?.features || [])].sort(
    (a, b) =>
      (typeof a.metadata?.order === "number" ? a.metadata.order : 0) -
      (typeof b.metadata?.order === "number" ? b.metadata.order : 0)
  );

  return (
    <section id="features" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Choose <span className="gradient-text">Messages Lab?</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to manage SMS through your own device.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const icon = typeof feature.metadata?.icon === "string"
              ? feature.metadata.icon
              : "";
            const Icon = iconMap[icon] || Smartphone;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group rounded-2xl border border-slate-200 bg-white p-8 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-5 group-hover:bg-indigo-100 transition-colors">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}