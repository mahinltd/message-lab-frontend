"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";
import { getApiErrorMessage } from "@/lib/utils";

declare global {
  interface GoogleIdentity {
    initialize(options: { client_id?: string; callback: (response: { credential: string }) => void; auto_select: boolean; ux_mode: string }): void;
    renderButton(container: HTMLElement, options: Record<string, string | number>): void;
  }

  interface Window {
    google?: { accounts?: { id?: GoogleIdentity } };
  }
}

const GIS_SRC = "https://accounts.google.com/gsi/client";

export function GoogleButton() {
  const router = useRouter();
  const { login } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const handledRef = useRef(false);
  const [configured] = useState(
    () => !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  );

  const handleCredential = async (response: { credential: string }) => {
    if (handledRef.current) return;
    handledRef.current = true;
    try {
      const res = await AuthService.googleLogin(response.credential);
      if (res.data.accessToken) {
        login(res.data.user, res.data.accessToken);
        toast.success(`Welcome, ${res.data.user.name}!`);
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Google login failed"));
      handledRef.current = false;
    }
  };

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;

    const init = () => {
      if (cancelled || !window.google?.accounts?.id || !containerRef.current) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredential,
        auto_select: false,
        ux_mode: "popup",
      });

      const width = Math.min(400, containerRef.current.clientWidth || 400);

      window.google.accounts.id.renderButton(containerRef.current, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        logo_alignment: "left",
        width,
      });
    };

    if (window.google?.accounts?.id) {
      init();
    } else {
      const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", init);
      } else {
        const script = document.createElement("script");
        script.src = GIS_SRC;
        script.async = true;
        script.defer = true;
        script.onload = init;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured]);

  if (!configured) {
    return (
      <div className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
        Google Sign-In is not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env.local
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div ref={containerRef} className="google-signin-btn w-full" />
    </div>
  );
}