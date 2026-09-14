"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-H2VKBF2S6B";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function isPublicPath(pathname: string) {
  return !["/admin", "/dashboard", "/login", "/register", "/verify-email", "/resend-verification", "/forgot-password", "/reset-password"].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId || !isPublicPath(pathname)) return;
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  if (!measurementId || !isPublicPath(pathname)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="messagelab-google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; window.gtag = function(){window.dataLayer.push(arguments);}; window.gtag('js', new Date()); window.gtag('config', '${measurementId}', { send_page_view: false });`}
      </Script>
    </>
  );
}