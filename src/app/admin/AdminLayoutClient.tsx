"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SessionIssueBanner } from "@/components/auth/SessionIssueBanner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, isLoading, isAuthenticated, sessionCheckError, retrySession } = useAuth(true);

  useEffect(() => {
    if (isAuthenticated && user && user.role !== "admin") router.replace("/dashboard");
  }, [isAuthenticated, router, user]);

  if (isLoading && !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100"><div className="text-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" /><p className="text-sm text-slate-500 mt-3">Verifying admin access...</p></div></div>;
  }
  if (!isAuthenticated) return null;
  if (user?.role !== "admin") return <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4"><div className="text-center bg-white rounded-2xl border border-slate-200 p-10 max-w-md"><ShieldAlert className="w-8 h-8 text-red-600 mx-auto mb-5" /><h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2><p className="text-sm text-slate-500 mb-6">You do not have permission to access the admin panel.</p><Link href="/dashboard"><Button>Go to Dashboard</Button></Link></div></div>;

  return <div className="min-h-screen bg-slate-100"><AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="lg:pl-64"><AdminTopbar onMenuClick={() => setSidebarOpen(true)} /><main className="p-4 sm:p-6 lg:p-8">{sessionCheckError && <SessionIssueBanner onRetry={() => void retrySession()} retrying={isLoading} />}{children}</main></div></div>;
}
