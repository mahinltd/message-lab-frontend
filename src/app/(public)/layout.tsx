import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { fetchContent } from "@/lib/server/content";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await fetchContent();

  return (
    <>
      <AnimatedBackground />
      <Navbar content={content} />
      <main className="min-h-screen">{children}</main>
      <Footer content={content} />
    </>
  );
}