"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Send, Smartphone, CreditCard, MessageSquare, ArrowRight, Plus, Loader2,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { SmsService } from "@/lib/sms";
import { DeviceService } from "@/lib/device";
import { BillingService } from "@/lib/billing";
import { SmsCampaign, Device } from "@/types";
import { timeAgo } from "@/lib/utils";

export default function DashboardOverview() {
  const [campaigns, setCampaigns] = useState<SmsCampaign[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [planName, setPlanName] = useState("Free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [campRes, devRes, subRes] = await Promise.all([
          SmsService.getCampaigns(1, 5),
          DeviceService.getDevices(),
          BillingService.getSubscription().catch(() => null),
        ]);
        setCampaigns(campRes.campaigns || []);
        setDevices(devRes || []);
        if (subRes?.currentPlan?.planName) setPlanName(subRes.currentPlan.planName);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalSent = campaigns.reduce((s, c) => s + c.successCount, 0);
  const activeDevice = devices.find((d) => d.status === "active");
  const disabledDevice = devices.find((d) => d.status === "disabled");
  const deviceStatus = activeDevice ? "Online" : disabledDevice ? "Disabled" : "Offline";

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
        <StatCard label="Messages Sent" value={totalSent} icon={Send} />
        <StatCard
          label="Device Status"
          value={deviceStatus}
          icon={Smartphone}
          iconBg={activeDevice ? "bg-green-50" : "bg-slate-100"}
          iconColor={activeDevice ? "text-green-600" : "text-slate-500"}
        />
        <StatCard label="Current Plan" value={planName} icon={CreditCard} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard label="Campaigns" value={campaigns.length} icon={MessageSquare} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      {/* Device banner if none */}
      {!activeDevice && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-indigo-900">Connect your device</h3>
            <p className="text-sm text-indigo-700 mt-1">
              Connect your Android phone to start sending SMS through your own SIM.
            </p>
          </div>
          <Link href="/dashboard/devices">
            <Button size="md" className="gap-2">
              <Plus className="w-4 h-4" /> Connect Device
            </Button>
          </Link>
        </div>
      )}

      {/* Recent campaigns */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">Recent Campaigns</h2>
          <Link href="/dashboard/sms" className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">No campaigns yet</p>
            <p className="text-sm text-slate-500 mt-1">Create your first SMS campaign to get started.</p>
            <Link href="/dashboard/sms" className="inline-block mt-4">
              <Button size="md">Send Your First SMS</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {campaigns.map((c) => (
              <Link
                key={c._id}
                href={`/dashboard/sms/${c._id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {c.campaignName || "Untitled Campaign"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {c.totalRecipients} recipients · {timeAgo(c.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 hidden sm:block">
                    {c.successCount}/{c.totalRecipients} sent
                  </span>
                  <StatusBadge status={c.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}