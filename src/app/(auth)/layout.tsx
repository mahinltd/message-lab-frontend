import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center px-4 py-16 sm:py-20">
        {children}
      </div>
    </>
  );
}