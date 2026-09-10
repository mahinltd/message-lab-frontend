"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Mail, Home } from "lucide-react";
import type { PageContent } from "@/types";

interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
  anchor?: boolean;
}

const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "/features", anchor: true },
      { name: "Pricing", href: "/pricing", anchor: true },
      { name: "How It Works", href: "/how-it-works", anchor: true },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Anti-Spam Policy", href: "/anti-spam" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Documentation", href: "/docs" },
      { name: "Status", href: "/status" },
      { name: "Contact Support", href: "/support" },
    ],
  },
];

export function Footer({ content }: { content: PageContent }) {

  // Dynamic content from admin panel
  const description =
    content?.footer?.footer_description?.body ||
    content?.footer?.footer_description_text?.body ||
    "Turn your Android phone into a personal SMS gateway. Send, receive, and manage SMS through your own device.";

  const copyright =
    content?.footer?.footer_copyright?.body ||
    `© ${new Date().getFullYear()} Messages Lab. All rights reserved.`;

  const tagline =
    content?.footer?.footer_tagline?.body || "Made with ❤️ in Bangladesh";

  const facebookUrl =
    content?.footer?.footer_social_facebook?.body ||
    "https://www.facebook.com/tanvir8268";

  const supportEmail =
    content?.footer?.footer_support_email?.body || "support@messagelab.tech";

  // Handle anchor navigation smoothly
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              {/* Logo — separated from nav */}
              <Link href="/" className="flex items-center gap-2.5 mb-4 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Messages<span className="text-indigo-600">Lab</span>
                </span>
              </Link>

              {/* Dynamic description */}
              <p className="text-sm text-slate-600 max-w-xs leading-relaxed mb-6">
                {description}
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-2.5">
                {/* Home */}
                <Link
                  href="/"
                  className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
                  aria-label="Home"
                  title="Go to Homepage"
                >
                  <Home className="w-4.5 h-4.5" />
                </Link>

                {/* Facebook — Official Icon */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#1877F2] hover:text-white transition-all duration-200"
                  aria-label="Facebook"
                  title="Follow us on Facebook"
                >
                  <span className="text-sm font-bold" aria-hidden="true">f</span>
                </a>

                {/* Email — Official Icon */}
                <a
                  href={`mailto:${supportEmail}?subject=Messages Lab Support`}
                  className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition-all duration-200"
                  aria-label="Email Us"
                  title={`Email: ${supportEmail}`}
                >
                  <Mail className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>

            {/* Navigation Columns */}
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) =>
                    link.anchor ? (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          onClick={(e) => handleAnchorClick(e, link.href)}
                          className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                          {link.name}
                        </a>
                      </li>
                    ) : (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar — Dynamic Copyright */}
        <div className="py-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500">{copyright}</p>
          <p className="text-sm text-slate-400">{tagline}</p>
        </div>
      </div>
    </footer>
  );
}