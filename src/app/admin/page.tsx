"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, UserCheck, UserX, CreditCard, Smartphone, Wallet, Loader2, ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AdminService } from "@/lib/admin";
import { timeAgo } from "@/lib/utils";

interface Stats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  disabledUsers: number;
  activeSubscriptions: number;
  connectedDevices: number;
  registrationTrend: { last24h: number; last7d: number; last30d: number };
}

interface PaymentStats {
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  totalRevenue: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [payStats, setPayStats] = useState<PaymentStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, p, r] = await Promise.all([
          AdminService.getUserStats(),
          AdminService.getPaymentStats(),
          AdminService.getRecentUsers(),
        ]);
        setStats(s);
        setPayStats(p);
        setRecentUsers(r.users || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Users" value={stats?.totalUsers ?? 0} icon={Users} />
        <StatCard
          label="Verified Users"
          value={stats?.verifiedUsers ?? 0}
          icon={UserCheck}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          label="Unverified"
          value={stats?.unverifiedUsers ?? 0}
          icon={UserX}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          label="Active Subs"
          value={stats?.activeSubscriptions ?? 0}
          icon={CreditCard}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Connected Devices"
          value={stats?.connectedDevices ?? 0}
          icon={Smartphone}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Pending Payments"
          value={(payStats?.pending ?? 0) + (payStats?.underReview ?? 0)}
          icon={Wallet}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          label="Total Revenue"
          value={`৳${payStats?.totalRevenue ?? 0}`}
          icon={CreditCard}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          label="New (7 days)"
          value={stats?.registrationTrend?.last7d ?? 0}
          icon={Users}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
      </div>

      {/* Two panels */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent registrations */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Recent Registrations</h3>
            <Link href="/admin/users" className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentUsers.slice(0, 6).map((u: any) => (
              <Link
                key={u._id}
                href={`/admin/users/${u._id}`}
                className="flex items-center justify-between px-6 py-3 hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{u.name}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={u.isEmailVerified ? "active" : "pending"} />
                  <span className="text-xs text-slate-400 hidden sm:block">{timeAgo(u.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pending payments */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Payment Summary</h3>
            <Link href="/admin/payments" className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1">
              Review <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            {[
              { label: "Pending", value: payStats?.pending ?? 0, color: "text-amber-600 bg-amber-50" },
              { label: "Under Review", value: payStats?.underReview ?? 0, color: "text-blue-600 bg-blue-50" },
              { label: "Approved", value: payStats?.approved ?? 0, color: "text-green-600 bg-green-50" },
              { label: "Rejected", value: payStats?.rejected ?? 0, color: "text-red-600 bg-red-50" },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl p-4 ${item.color}`}>
                <p className="text-2xl font-extrabold">{item.value}</p>
                <p className="text-xs font-medium mt-0.5 opacity-80">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}