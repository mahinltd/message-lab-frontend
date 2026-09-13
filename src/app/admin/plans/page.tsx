"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Pencil, Power } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AdminService } from "@/lib/admin";
import { PlanConfig } from "@/types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/utils";

interface PlanEdit {
  planId: string;
  name: string;
  displayName: string;
  description: string | null;
  priceMonthly: number | string;
  priceYearly: number | string;
  currency: string;
  maxRecipientsPerCampaign: number | string;
  maxDailyMessages: number | string;
  maxDevices: number | string;
  minSmsDelayMs: number | string;
  apiAccess: boolean;
  otpEnabled: boolean;
  maxDailyOtpRequests: number | string;
  featuresText: string;
  isActive: boolean;
  sortOrder: number | string;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PlanEdit | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const data = await AdminService.getPlans(true);
      setPlans(data.plans || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    AdminService.getPlans(true)
      .then((data) => {
        if (!cancelled) setPlans(data.plans || []);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const openEdit = (p: PlanConfig) => {
    setEditing({
      ...p,
      name: p.planId,
      featuresText: (p.features || []).join("\n"),
      apiAccess: p.apiAccess ?? false,
      otpEnabled: p.otpEnabled ?? false,
      maxDailyOtpRequests: p.maxDailyOtpRequests ?? 0,
    });
  };

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      await AdminService.upsertPlan({
        planId: editing.planId,
        name: editing.name,
        displayName: editing.displayName,
        description: editing.description || null,
        priceMonthly: Number(editing.priceMonthly) || 0,
        priceYearly: Number(editing.priceYearly) || 0,
        currency: editing.currency || "BDT",
        maxRecipientsPerCampaign: Number(editing.maxRecipientsPerCampaign) || 0,
        maxDailyMessages: Number(editing.maxDailyMessages) || 0,
        maxDevices: Number(editing.maxDevices) || 1,
        minSmsDelayMs: Number(editing.minSmsDelayMs) || 3000,
        apiAccess: editing.apiAccess,
        otpEnabled: editing.otpEnabled,
        maxDailyOtpRequests: Number(editing.maxDailyOtpRequests) || 0,
        features: (editing.featuresText || "").split("\n").map((f: string) => f.trim()).filter(Boolean),
        isActive: editing.isActive ?? true,
        sortOrder: Number(editing.sortOrder) || 0,
      });
      toast.success("Plan saved");
      void AdminService.revalidatePublicContent().catch(() => undefined);
      setEditing(null);
      load();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Save failed"));
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (planId: string) => {
    try {
      await AdminService.togglePlan(planId);
      toast.success("Plan status toggled");
      void AdminService.revalidatePublicContent().catch(() => undefined);
      load();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Toggle failed"));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Plan Manager</h2>
        <p className="text-sm text-slate-500 mt-1">Configure pricing, limits, and features for each plan.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-indigo-600" /></div>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div key={p.planId} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{p.displayName}</h3>
                  <p className="text-xs text-slate-500 font-mono">{p.planId}</p>
                </div>
                <StatusBadge status={p.isActive ? "active" : "disabled"} />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">৳{p.priceMonthly}<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                <li>• {p.maxRecipientsPerCampaign >= 999999 ? "Unlimited" : p.maxRecipientsPerCampaign} recipients/campaign</li>
                <li>• {p.maxDailyMessages} messages/day</li>
                <li>• {p.maxDevices} device(s)</li>
              </ul>
              <div className="mt-5 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => openEdit(p)}>
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => toggle(p.planId)}>
                  <Power className="w-3.5 h-3.5" /> {p.isActive ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={`Edit Plan: ${editing?.displayName || ""}`} maxWidth="max-w-xl">
        {editing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input id="p-name" label="Internal Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <Input id="p-display" label="Display Name" value={editing.displayName} onChange={(e) => setEditing({ ...editing, displayName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={editing.apiAccess} onChange={(e) => setEditing({ ...editing, apiAccess: e.target.checked })} /> API access
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={editing.otpEnabled} onChange={(e) => setEditing({ ...editing, otpEnabled: e.target.checked })} /> OTP enabled
              </label>
            </div>
            <Input id="p-otp-daily" type="number" label="Max Daily OTP Requests" value={String(editing.maxDailyOtpRequests)} onChange={(e) => setEditing({ ...editing, maxDailyOtpRequests: e.target.value })} />
            <Input id="p-desc" label="Description" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input id="p-monthly" type="number" label="Price Monthly" value={String(editing.priceMonthly)} onChange={(e) => setEditing({ ...editing, priceMonthly: e.target.value })} />
              <Input id="p-yearly" type="number" label="Price Yearly" value={String(editing.priceYearly)} onChange={(e) => setEditing({ ...editing, priceYearly: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input id="p-recip" type="number" label="Max Recipients" value={String(editing.maxRecipientsPerCampaign)} onChange={(e) => setEditing({ ...editing, maxRecipientsPerCampaign: e.target.value })} />
              <Input id="p-daily" type="number" label="Max Daily Messages" value={String(editing.maxDailyMessages)} onChange={(e) => setEditing({ ...editing, maxDailyMessages: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input id="p-devices" type="number" label="Max Devices" value={String(editing.maxDevices)} onChange={(e) => setEditing({ ...editing, maxDevices: e.target.value })} />
              <Input id="p-delay" type="number" label="Min Delay (ms)" value={String(editing.minSmsDelayMs)} onChange={(e) => setEditing({ ...editing, minSmsDelayMs: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Features (one per line)</label>
              <textarea
                value={editing.featuresText || ""}
                onChange={(e) => setEditing({ ...editing, featuresText: e.target.value })}
                rows={5}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="md" className="flex-1" onClick={() => setEditing(null)}>Cancel</Button>
              <Button variant="primary" size="md" className="flex-1" onClick={save} isLoading={busy}>Save Plan</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}