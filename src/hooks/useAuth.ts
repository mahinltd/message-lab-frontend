"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";

export function useAuth(requireAuth: boolean = false) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setAccessToken, setLoading } =
    useAuthStore();

  useEffect(() => {
    async function checkAuth() {
      // Always start as loading
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        if (requireAuth) {
          router.push("/login");
        }
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.data.user);
        setAccessToken(token);
      } catch {
        // Token invalid/expired and refresh failed
        // Clean up everything
        localStorage.removeItem("accessToken");
        setUser(null);
        setAccessToken(null);
        if (requireAuth) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, isAuthenticated, isLoading };
}