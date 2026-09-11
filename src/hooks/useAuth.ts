"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";

type SessionErrorKind = "transient" | "rate-limit" | "invalid";
type SessionError = Error & { flag?: string; response?: { status?: number } };

let sessionRequest: Promise<unknown> | null = null;
let sessionRequestToken: string | null = null;

function sessionKind(error: SessionError): SessionErrorKind {
  if (error.flag === "rate-limit" || error.response?.status === 429) return "rate-limit";
  if (error.flag === "transient" || !error.response?.status || (error.response.status >= 500)) return "transient";
  return "invalid";
}

function fetchSession(token: string) {
  if (!sessionRequest || sessionRequestToken !== token) {
    sessionRequestToken = token;
    sessionRequest = api.get("/auth/me").then(({ data }) => data.data.user).catch((error) => {
      sessionRequest = null;
      sessionRequestToken = null;
      throw error;
    });
  }
  return sessionRequest as Promise<ReturnType<typeof useAuthStore.getState>["user"]>;
}

export function useAuth(requireAuth: boolean = false) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setAccessToken, setLoading } =
    useAuthStore();
  const [sessionCheckError, setSessionCheckError] = useState<SessionErrorKind | null>(null);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCount = useRef(0);

  const checkAuth = useCallback(() => {
    const runCheck = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        if (requireAuth) router.replace("/login");
        return;
      }

      const currentUser = useAuthStore.getState().user;
      if (currentUser && useAuthStore.getState().accessToken === token) {
        setLoading(false);
        setSessionCheckError(null);
        return;
      }

      setLoading(true);
      try {
        const nextUser = await fetchSession(token);
        setUser(nextUser);
        setAccessToken(token);
        setSessionCheckError(null);
        retryCount.current = 0;
      } catch (error: unknown) {
        const typedError = error as SessionError;
        const kind = sessionKind(typedError);
        if (kind === "invalid") {
          setUser(null);
          setAccessToken(null);
          if (requireAuth) router.replace("/login");
        } else {
          setSessionCheckError(kind);
          const delays = [5000, 15000, 60000];
          const delay = delays[Math.min(retryCount.current, delays.length - 1)];
          retryCount.current += 1;
          if (retryTimer.current) clearTimeout(retryTimer.current);
          retryTimer.current = setTimeout(() => { void runCheck(); }, delay);
        }
      } finally {
        setLoading(false);
      }
    };
    return runCheck();
  }, [requireAuth, router, setAccessToken, setLoading, setUser]);

  useEffect(() => {
    void checkAuth();
    return () => { if (retryTimer.current) clearTimeout(retryTimer.current); };
  }, [checkAuth]);

  return { user, isAuthenticated, isLoading, sessionCheckError, retrySession: checkAuth };
}