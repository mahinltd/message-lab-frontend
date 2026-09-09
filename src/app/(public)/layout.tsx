"use client";

import React, { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { useContentStore } from "@/stores/contentStore";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { content, fetchContent } = useContentStore();

  useEffect(() => {
    if (!content) {
      fetchContent();
    }
  }, [content, fetchContent]);

  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}