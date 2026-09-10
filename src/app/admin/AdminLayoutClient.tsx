"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUser, setAccessToken, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function check() {
      const token = localStorage.getItem("accessToken");
      if (!token) { router.replace("/login"); return; }
      try { const { data } = await api.get("/auth/me"); const user = data.data.user; setUser(user); setAccessToken(token); setIsAdmin(user.role === "admin"); if (user.role !== "admin") router.replace("/dashboard"); }
      catch { localStorage.removeItem("accessToken"); logout(); router.replace("/login"); return; }
      setChecked(true);
    }
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) return <div className="min-h-screen flex items-center justify-center bg-slate-100"><div className="text-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" /><p className="text-sm text-slate-500 mt-3">Verifying admin access...</p></div></div>;
  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4"><div className="text-center bg-white rounded-2xl border border-slate-200 p-10 max-w-md"><div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-5"><ShieldAlert className="w-8 h-8 text-red-600" /></div><h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2><p className="text-sm text-slate-500 mb-6">You do not have permission to access the admin panel.</p><Link href="/dashboard" className="block"><Button variant="primary" size="lg" className="w-full">Go to Dashboard</Button></Link></div></div>;
  return <div className="min-h-screen bg-slate-100"><AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="lg:pl-64"><AdminTopbar onMenuClick={() => setSidebarOpen(true)} /><main className="p-4 sm:p-6 lg:p-8">{children}</main></div></div>;
}