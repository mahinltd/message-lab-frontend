import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <p className="text-sm font-semibold text-indigo-600">404</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">That page does not exist</h1>
        <p className="mt-3 text-slate-600">Return home or visit the Help Center to find your way around MessageLab.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">Home</Link>
          <Link href="/help" className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700">Help Center</Link>
        </div>
      </div>
    </main>
  );
}