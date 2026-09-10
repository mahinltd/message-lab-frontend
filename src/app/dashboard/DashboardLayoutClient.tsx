"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { accessToken, setUser, setAccessToken, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("accessToken") || accessToken;
      if (!token) { router.replace("/login"); return; }
      try { const { data } = await api.get("/auth/me"); setUser(data.data.user); setAccessToken(token); setIsAuthenticated(true); }
      catch { logout(); router.replace("/login"); return; }
      setAuthChecked(true);
    }
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authChecked) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" /><p className="text-sm text-slate-500 mt-3">Verifying your session...</p></div></div>;
  if (!isAuthenticated) return null;
  return <div className="min-h-screen bg-slate-50"><DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="lg:pl-64"><DashboardTopbar onMenuClick={() => setSidebarOpen(true)} /><main className="p-4 sm:p-6 lg:p-8">{children}</main></div></div>;
}