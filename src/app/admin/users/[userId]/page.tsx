"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2, ArrowLeft, MailCheck, Ban, CheckCircle2, Shield, Smartphone, CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AdminService } from "@/lib/admin";
import { formatDate, timeAgo, getInitials, getApiErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import { AdminAuditLog, Device, PaymentSubmission, Subscription, AdminUser } from "@/types";

interface UserDetails {
  user: AdminUser;
  devices: Device[];
  subscriptions: Subscription[];
  payments: PaymentSubmission[];
  recentAuditLogs: AdminAuditLog[];
}

export default function AdminUserDetails() {
  const params = useParams();
  const userId = params.userId as string;

  const [data, setData] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    try {
      const d = await AdminService.getUser(userId);
      setData(d);
    } catch {
      toast.error("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    AdminService.getUser(userId)
      .then((userData) => {
        if (!cancelled) setData(userData);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load user");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId]);

  const handleVerify = async () => {
    setBusy("verify");
    try {
      await AdminService.verifyUserEmail(userId);
      toast.success("Email verified");
      load();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed"));
    } finally {
      setBusy(null);
    }
  };

  const handleToggleStatus = async () => {
    if (!data) return;
    const isDisabled = !data.user.isAccountDisabled;
    let reason = "";
    if (isDisabled) {
      reason = prompt("Reason for disabling this account?") || "";
      if (reason === null) return;
    }
    setBusy("status");
    try {
      await AdminService.updateUserStatus(userId, isDisabled, reason);
      toast.success(isDisabled ? "Account disabled" : "Account enabled");
      load();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed"));
    } finally {
      setBusy(null);
    }
  };

  const handleToggleRole = async () => {
    if (!data) return;
    const newRole = data.user.role === "admin" ? "user" : "admin";
    if (!confirm(`Change role to "${newRole}"?`)) return;
    setBusy("role");
    try {
      await AdminService.updateUserRole(userId, newRole);
      toast.success(`Role changed to ${newRole}`);
      load();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed"));
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600">User not found.</p>
        <Link href="/admin/users" className="inline-block mt-4">
          <Button variant="outline">Back to Users</Button>
        </Link>
      </div>
    );
  }

  const { user, devices, subscriptions, payments, recentAuditLogs } = data;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </Link>

      {/* Profile card + actions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {getInitials(user.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                <StatusBadge status={user.role === "admin" ? "active" : "pending"} />
              </div>
              <p className="text-sm text-slate-500">{user.email}</p>
              <p className="text-sm text-slate-500">{user.mobile || "No mobile"}</p>
              <p className="text-xs text-slate-400 mt-1">Joined {formatDate(user.createdAt)}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {!user.isEmailVerified && (
              <Button size="md" variant="primary" onClick={handleVerify} isLoading={busy === "verify"} className="gap-1.5">
                <MailCheck className="w-4 h-4" /> Verify Email
              </Button>
            )}
            <Button
              size="md"
              variant={user.isAccountDisabled ? "primary" : "danger"}
              onClick={handleToggleStatus}
              isLoading={busy === "status"}
              className="gap-1.5"
            >
              {user.isAccountDisabled ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
              {user.isAccountDisabled ? "Enable" : "Disable"}
            </Button>
            <Button size="md" variant="outline" onClick={handleToggleRole} isLoading={busy === "role"} className="gap-1.5">
              <Shield className="w-4 h-4" />
              Make {user.role === "admin" ? "User" : "Admin"}
            </Button>
          </div>
        </div>
      </div>

      {/* Grid of related data */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Devices */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-slate-400" />
            <h3 className="text-base font-bold text-slate-900">Devices</h3>
          </div>
          {devices?.length ? (
            <div className="divide-y divide-slate-100">
              {devices.map((d) => (
                <div key={d._id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{d.deviceName}</p>
                    <p className="text-xs text-slate-500">{d.deviceModel || "Android"}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="px-6 py-8 text-sm text-slate-500 text-center">No devices</p>
          )}
        </div>

        {/* Subscriptions */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <h3 className="text-base font-bold text-slate-900">Subscriptions</h3>
          </div>
          {subscriptions?.length ? (
            <div className="divide-y divide-slate-100">
              {subscriptions.map((s) => (
                <div key={s._id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{s.planName}</p>
                    <p className="text-xs text-slate-500">
                      {formatDate(s.startedAt)} → {formatDate(s.expiresAt)}
                    </p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="px-6 py-8 text-sm text-slate-500 text-center">No subscriptions</p>
          )}
        </div>

        {/* Payments */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Payments</h3>
          </div>
          {payments?.length ? (
            <div className="divide-y divide-slate-100">
              {payments.map((p) => (
                <div key={p._id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 uppercase">{p.paymentMethod}</p>
                    <p className="text-xs text-slate-500">৳{p.amount} · {p.planId}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="px-6 py-8 text-sm text-slate-500 text-center">No payments</p>
          )}
        </div>

        {/* Audit logs */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
          </div>
          {recentAuditLogs?.length ? (
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {recentAuditLogs.map((l) => (
                <div key={l._id} className="px-6 py-3">
                  <p className="text-sm font-medium text-slate-900">{l.action}</p>
                  <p className="text-xs text-slate-500">{timeAgo(l.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-6 py-8 text-sm text-slate-500 text-center">No activity</p>
          )}
        </div>
      </div>
    </div>
  );
}