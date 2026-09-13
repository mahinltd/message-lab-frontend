import type { Metadata } from "next";
import Link from "next/link";
import { Download, Smartphone, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Download Android App",
  description: "Download the official MessageLab Android app and connect your phone to your personal SMS gateway.",
  alternates: { canonical: `${siteConfig.url}/download-apk` },
  robots: { index: true, follow: true },
};

export default function DownloadApkPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
            <Smartphone className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="mx-auto mt-6 max-w-xl text-center">
            <p className="text-sm font-semibold text-indigo-600">Official Android application</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Download MessageLab</h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Install MessageLab on the Android phone you want to pair with your dashboard and use its own SIM to send and receive SMS.
            </p>
            <a href="/downloads/MessageLab.apk" download="MessageLab.apk" className="mt-8 block">
              <Button size="lg" className="w-full gap-2 sm:w-auto sm:min-w-72">
                <Download className="h-5 w-5" /> Download the Android app
              </Button>
            </a>
          </div>

          <div className="mx-auto mt-10 grid max-w-xl gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Pair securely</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">Open the app and scan the QR code or enter the pairing code shown in your dashboard.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Use your own phone</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">Keep the app installed and connected on the Android phone you want to use as your gateway.</p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">After downloading, allow installation on your Android device if prompted, then open the app to connect it.</p>
          <div className="mt-5 text-center">
            <Link href="/" className="text-sm font-semibold text-indigo-600 hover:underline">Back to home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}