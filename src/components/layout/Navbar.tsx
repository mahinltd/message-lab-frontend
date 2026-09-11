"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import type { PageContent } from "@/types";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "Download App", href: "/download-apk" },
];

export function Navbar({ content }: { content: PageContent }) {
  const brandName = content.header.site_name?.title || "MessagesLab";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        isScrolled
          ? "bg-white/90 backdrop-blur-lg border-b border-slate-200/70 shadow-sm"
          : "bg-white border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-[68px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <MessageSquare className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            {brandName}
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.name} href={l.href} className="text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors">
              {l.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <Link href="/dashboard"><Button size="md">Dashboard</Button></Link>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="md">Log In</Button></Link>
              <Link href="/register"><Button size="md">Get Started Free</Button></Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((l) => (
                <a key={l.name} href={l.href} onClick={() => setIsMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-medium">
                  {l.name}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-slate-100 space-y-2">
                {isAuthenticated ? (
                  <Link href="/dashboard" className="block"><Button className="w-full">Dashboard</Button></Link>
                ) : (
                  <>
                    <Link href="/login" className="block"><Button variant="outline" className="w-full">Log In</Button></Link>
                    <Link href="/register" className="block"><Button className="w-full">Get Started Free</Button></Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}