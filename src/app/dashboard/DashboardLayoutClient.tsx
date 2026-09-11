"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { SessionIssueBanner } from "@/components/auth/SessionIssueBanner";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { Loader2 } from "lucide-react";

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoading, isAuthenticated, sessionCheckError, retrySession } = useAuth(true);

  if (isLoading && !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" /><p className="text-sm text-slate-500 mt-3">Verifying your session...</p></div></div>;
  }
  if (!isAuthenticated) return null;

  return <div className="min-h-screen bg-slate-50"><DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="lg:pl-64"><DashboardTopbar onMenuClick={() => setSidebarOpen(true)} /><main className="p-4 sm:p-6 lg:p-8">{sessionCheckError && <SessionIssueBanner onRetry={() => void retrySession()} retrying={isLoading} />}{children}</main></div></div>;
}
