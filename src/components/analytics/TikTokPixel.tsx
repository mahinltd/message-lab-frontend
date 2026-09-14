"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
const excludedPaths = [
  "/admin",
  "/dashboard",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/resend-verification",
  "/email-change",
];

function isPublicPath(pathname: string): boolean {
  return !excludedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

declare global {
  interface Window {
    TiktokAnalyticsObject?: string;
    ttq?: TikTokQueue;
    __messagelabTikTokInitialized?: boolean;
    __messagelabTikTokLastPath?: string;
  }
}

interface TikTokQueue {
  (...args: unknown[]): void;
  methods?: string[];
  setAndDefer?: (target: TikTokQueue, method: string) => void;
  load?: (id: string, options?: { partner?: string }) => void;
  page?: () => void;
  _i?: Record<string, unknown>;
  _u?: string;
  _t?: Record<string, number>;
  _o?: Record<string, unknown>;
}

export function TikTokPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pixelId || !isPublicPath(pathname)) return;
    const previous = window.__messagelabTikTokLastPath;
    if (previous && previous !== pathname && isPublicPath(previous)) {
      window.ttq?.page?.();
    }
    window.__messagelabTikTokLastPath = pathname;
  }, [pathname]);

  if (!pixelId || !isPublicPath(pathname)) return null;

  return (
    <Script id="messagelab-tiktok-pixel" strategy="afterInteractive">
      {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))};};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=d.createElement("script");n.type="text/javascript";n.async=!0;n.src=r+"?sdkid="+e+"&lib="+t;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(n,s)};if(!w.__messagelabTikTokInitialized){ttq.load("${pixelId}");ttq.page();w.__messagelabTikTokInitialized=true;}}(window,document,"ttq");`}
    </Script>
  );
}