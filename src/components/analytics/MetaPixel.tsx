"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const excludedPaths = [
  "/admin",
  "/dashboard",
  "/login",
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

export function MetaPixel() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const previous = previousPathname.current;
    previousPathname.current = pathname;

    if (!pixelId || previous === pathname || !isPublicPath(pathname)) return;
    if (isPublicPath(previous) || window.__messagelabMetaInitialized) {
      window.fbq?.("track", "PageView");
    }
  }, [pathname]);

  if (!pixelId || !isPublicPath(pathname)) return null;

  return (
    <>
      <Script id="messagelab-meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,
'script','https://connect.facebook.net/en_US/fbevents.js');
if(!window.__messagelabMetaInitialized){fbq('init','${pixelId}');fbq('track','PageView');window.__messagelabMetaInitialized=true;if(window.__messagelabMetaEventQueue){window.__messagelabMetaEventQueue.forEach(function(args){fbq.apply(null,args)});window.__messagelabMetaEventQueue=[];}}`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{ display: "none" }} src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`} alt="" />
      </noscript>
    </>
  );
}