"use client";

import React, { useEffect, useState } from "react";
import { Copy, ExternalLink, KeyRound, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AccountService } from "@/lib/account";
import { BillingService } from "@/lib/billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatDate, getApiErrorMessage } from "@/lib/utils";

interface ApiKeyRecord {
  _id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  isActive: boolean;
  lastUsedAt?: string | null;
  revokedAt?: string | null;
  createdAt: string;
}

interface PlanAccess {
  planName: string;
  apiAccess?: boolean;
  otpEnabled?: boolean;
  maxDailyOtpRequests?: number;
  maxDailyMessages?: number;
}

export default function DeveloperPage() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [plan, setPlan] = useState<PlanAccess | null>(null);
  const [usage, setUsage] = useState<DeveloperUsage | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ApiKeyRecord | null>(null);

  const load = async () => {
    try {
      const [credentials, subscription, currentUsage] = await Promise.all([
        AccountService.listApiKeys(),
        BillingService.getSubscription(),
        AccountService.getDeveloperUsage(),
      ]);
      setKeys(credentials || []);
      setPlan(subscription?.currentPlan || null);
      setUsage(currentUsage || null);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Unable to load developer access"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([AccountService.listApiKeys(), BillingService.getSubscription(), AccountService.getDeveloperUsage()])
      .then(([credentials, subscription, currentUsage]) => {
        setKeys(credentials || []);
        setPlan(subscription?.currentPlan || null);
        setUsage(currentUsage || null);
      })
      .catch((error: unknown) => {
        toast.error(getApiErrorMessage(error, "Unable to load developer access"));
      })
      .finally(() => setLoading(false));
  }, []);

  const createKey = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const result = await AccountService.createApiKey(name.trim());
      setNewSecret(result.apiKey);
      setName("");
      await load();
      toast.success("API key created");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Unable to create API key"));
    } finally {
      setSaving(false);
    }
  };

  const revokeKey = async () => {
    if (!revokeTarget) return;
    try {
      await AccountService.revokeApiKey(revokeTarget._id);
      setRevokeTarget(null);
      await load();
      toast.success("API key revoked");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Unable to revoke API key"));
    }
  };

  const copySecret = async () => {
    if (!newSecret) return;
    await navigator.clipboard.writeText(newSecret);
    toast.success("API key copied");
  };

  const apiEnabled = Boolean(plan?.apiAccess);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Developer API</h2>
        <p className="mt-1 text-sm text-slate-500">Manage credentials for MessageLab&apos;s SMS and OTP APIs.</p>
      </div>

      <div className={`rounded-2xl border p-5 ${apiEnabled ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
        <div className="flex items-start gap-3">
          <ShieldCheck className={`mt-0.5 h-5 w-5 ${apiEnabled ? "text-green-600" : "text-amber-600"}`} />
          <div>
            <p className="font-semibold text-slate-900">{plan?.planName || "Current plan"}</p>
            <p className="mt-1 text-sm text-slate-600">
              {apiEnabled ? "API access is enabled for this plan." : "API access is not enabled for this plan."}
              {plan?.otpEnabled ? ` OTP quota: ${plan.maxDailyOtpRequests || 0} requests per day.` : " OTP access is not enabled."}
            </p>
            <p className="mt-1 text-xs text-slate-500">Today: {usage?.smsMessages ?? 0}/{usage?.smsLimit ?? plan?.maxDailyMessages ?? "Unavailable"} SMS messages · {usage?.otpRequests ?? 0}/{usage?.otpLimit ?? plan?.maxDailyOtpRequests ?? 0} OTP requests</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900">API keys</h3>
            <p className="mt-1 text-sm text-slate-500">Keys are shown in full only once when created.</p>
          </div>
          <a href="/docs" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline">
            Documentation <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {apiEnabled && (
          <form onSubmit={createKey} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Input id="api-key-name" label="Key name" placeholder="Production checkout" value={name} onChange={(event) => setName(event.target.value)} />
            <Button type="submit" className="mt-auto gap-2" disabled={!name.trim()} isLoading={saving}><Plus className="h-4 w-4" /> Create key</Button>
          </form>
        )}

        {loading ? <p className="mt-6 text-sm text-slate-500">Loading API keys...</p> : keys.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <KeyRound className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">No API keys yet</p>
            <p className="mt-1 text-sm text-slate-500">Create a key when you are ready to connect an application.</p>
          </div>
        ) : (
          <div className="mt-6 divide-y divide-slate-100">
            {keys.map((key) => (
              <div key={key._id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2"><p className="font-semibold text-slate-900 truncate">{key.name}</p><StatusBadge status={key.isActive ? "active" : "revoked"} /></div>
                  <p className="mt-1 font-mono text-xs text-slate-500">{key.keyPrefix}••••••••</p>
                  <p className="mt-1 text-xs text-slate-400">Created {formatDate(key.createdAt)} · Last used {key.lastUsedAt ? formatDate(key.lastUsedAt) : "Never"}</p>
                </div>
                {key.isActive && <Button variant="danger" size="sm" className="gap-1.5 self-start" onClick={() => setRevokeTarget(key)}><Trash2 className="h-3.5 w-3.5" /> Revoke</Button>}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={Boolean(newSecret)} onClose={() => setNewSecret(null)} title="Save your API key now">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">This secret will not be shown again. Store it in your server-side environment, never in browser code.</p>
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-3"><code className="min-w-0 flex-1 break-all text-xs text-slate-800">{newSecret}</code><button className="rounded-lg p-2 text-slate-600 hover:bg-white" onClick={() => void copySecret()} title="Copy API key"><Copy className="h-4 w-4" /></button></div>
          <Button className="w-full" onClick={() => setNewSecret(null)}>I have saved it</Button>
        </div>
      </Modal>

      <Modal open={Boolean(revokeTarget)} onClose={() => setRevokeTarget(null)} title="Revoke API key?">
        <div className="space-y-4"><p className="text-sm text-slate-600">Applications using <strong>{revokeTarget?.name}</strong> will lose API access immediately.</p><div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => setRevokeTarget(null)}>Cancel</Button><Button variant="danger" className="flex-1" onClick={() => void revokeKey()}>Revoke key</Button></div></div>
      </Modal>
    </div>
  );
}

interface DeveloperUsage {
  otpRequests: number;
  otpLimit: number;
  smsMessages: number;
  smsLimit: number;
}