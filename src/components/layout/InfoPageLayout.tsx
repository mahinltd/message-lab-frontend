import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchContent } from "@/lib/server/content";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

interface InfoPageLayoutProps {
  title: string;
  contentKey: string;
  defaultContent: string;
  lastUpdated?: string;
}

export async function InfoPageLayout({
  title,
  contentKey,
  defaultContent,
  lastUpdated,
}: InfoPageLayoutProps) {
  const content = await fetchContent();

  const pageContent =
    content?.legal?.[contentKey]?.body ||
    content?.pages?.[contentKey]?.body ||
    defaultContent;

  const pageTitle =
    content?.legal?.[contentKey]?.title ||
    content?.pages?.[contentKey]?.title ||
    title;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: pageTitle },
    ],
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {/* Back to home */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          {pageTitle}
        </h1>
        {lastUpdated && (
          <p className="text-sm text-slate-500">Last updated: {lastUpdated}</p>
        )}
      </header>

      {/* Content — renders HTML or plain text */}
      <div
        className="prose prose-slate prose-lg max-w-none
          prose-headings:text-slate-900 prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-li:text-slate-600
          prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-slate-900"
        dangerouslySetInnerHTML={{ __html: pageContent }}
      />

      {/* Footer CTA */}
      <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Have questions? We&apos;re here to help.
        </p>
        <div className="flex gap-3">
          <Link href="/contact">
            <Button variant="outline" size="md">Contact Us</Button>
          </Link>
          <Link href="/">
            <Button variant="primary" size="md">Back to Home</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}