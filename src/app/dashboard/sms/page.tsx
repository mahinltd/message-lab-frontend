"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ComposeSmsForm } from "@/components/sms/ComposeSmsForm";
import { SmsService } from "@/lib/sms";
import { BillingService } from "@/lib/billing";
import { SmsCampaign } from "@/types";
import { timeAgo } from "@/lib/utils";

export default function SmsPage() {
  const [campaigns, setCampaigns] = useState<SmsCampaign[]>([]);
  const [maxRecipients, setMaxRecipients] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [campRes, subRes] = await Promise.all([
          SmsService.getCampaigns(1, 20),
          BillingService.getSubscription().catch(() => null),
        ]);
        setCampaigns(campRes.campaigns || []);
        if (subRes?.currentPlan?.maxRecipientsPerCampaign) {
          setMaxRecipients(subRes.currentPlan.maxRecipientsPerCampaign);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Messages</h2>
          <p className="text-sm text-slate-500 mt-1">
            Create and manage your SMS campaigns.
          </p>
        </div>
        <Button size="md" className="gap-2" onClick={() => setShowCompose(!showCompose)}>
          <Plus className="w-4 h-4" />
          {showCompose ? "Close" : "New Campaign"}
        </Button>
      </div>

      {/* Compose panel */}
      {showCompose && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-5">Compose Campaign</h3>
          <ComposeSmsForm maxRecipients={maxRecipients} />
        </div>
      )}

      {/* Campaign list */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Campaign History</h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">No campaigns yet</p>
            <p className="text-sm text-slate-500 mt-1">Create your first campaign to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {campaigns.map((c) => (
              <Link
                key={c._id}
                href={`/dashboard/sms/${c._id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {c.campaignName || "Untitled Campaign"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {c.totalRecipients} recipients · {timeAgo(c.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs text-slate-500 hidden sm:block">
                    {c.successCount}/{c.totalRecipients}
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