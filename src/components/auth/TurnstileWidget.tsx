"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove?: (widgetId?: string) => void;
    };
  }
}

export interface TurnstileWidgetHandle {
  reset: () => void;
}

interface TurnstileWidgetProps {
  onVerify: (token: string | null) => void;
  onExpire: () => void;
  onError: () => void;
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Turnstile failed to load")), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.turnstile = "true";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Turnstile failed to load"));
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(function TurnstileWidget({ onVerify, onExpire, onError }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const callbacksRef = useRef({ onVerify, onExpire, onError });
  callbacksRef.current = { onVerify, onExpire, onError };
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const reset = () => {
    if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
    onVerify(null);
  };
  useImperativeHandle(ref, () => ({ reset }));

  useEffect(() => {
    if (!siteKey) {
      onVerify(null);
      return;
    }
    let disposed = false;
    loadTurnstile().then(() => {
      if (disposed || !containerRef.current || !window.turnstile || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "light",
        callback: (token: string) => callbacksRef.current.onVerify(token),
        "expired-callback": () => callbacksRef.current.onExpire(),
        "error-callback": () => callbacksRef.current.onError(),
      });
    }).catch(() => callbacksRef.current.onError());
    return () => {
      disposed = true;
      if (widgetIdRef.current && window.turnstile?.remove) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = undefined;
    };
  // Callback refs keep the widget mounted while parent form state changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  if (!siteKey) return null;
  return <div ref={containerRef} className="min-h-[65px]" aria-label="Security verification" />;
});