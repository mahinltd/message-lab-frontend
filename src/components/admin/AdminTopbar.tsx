"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { AuthService } from "@/lib/auth";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

const titles: Record<string, string> = {
  "/admin": "Admin Overview",
  "/admin/users": "User Management",
  "/admin/payments": "Payment Review",
  "/admin/content": "Content Manager",
  "/admin/plans": "Plan Manager",
  "/admin/settings": "Platform Settings",
  "/admin/security": "Security Logs",
  "/admin/jobs": "Scheduled Jobs",
};

interface AdminTopbarProps {
  onMenuClick: () => void;
}

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const title =
    titles[pathname] ||
    (pathname.startsWith("/admin/users/") ? "User Details" : "Admin");

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch {}
    logout();
    toast.success("Logged out");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-lg border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <ShieldCheck className="w-3 h-3" /> Admin
          </span>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {user ? getInitials(user.name) : "?"}
          </div>
          <span className="hidden sm:block text-sm font-medium text-slate-700">{user?.name}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}