"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SmsService } from "@/lib/sms";
import { SmsCampaign, SmsJob } from "@/types";
import { timeAgo } from "@/lib/utils";
import { toast } from "sonner";

const ACTIVE_STATUSES = ["queued", "processing", "paused"];

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId as string;

  const [campaign, setCampaign] = useState<SmsCampaign | null>(null);
  const [jobs, setJobs] = useState<SmsJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const load = async () => {
    try {
      const [camp, jobsRes] = await Promise.all([
        SmsService.getCampaign(campaignId),
        SmsService.getCampaignJobs(campaignId, 1, 100),
      ]);
      setCampaign(camp);
      setJobs(jobsRes.jobs || []);
      return camp;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  // Auto-refresh while campaign is active
  useEffect(() => {
    if (campaign && ACTIVE_STATUSES.includes(campaign.status)) {
      intervalRef.current = setInterval(() => {
        load();
      }, 4000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign?.status]);

  const handleCancel = async () => {
    if (!confirm("Cancel this campaign? Unsent messages will be stopped.")) return;
    setCancelling(true);
    try {
      await SmsService.cancelCampaign(campaignId);
      toast.success("Campaign cancelled");
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600">Campaign not found.</p>
        <Link href="/dashboard/sms" className="inline-block mt-4">
          <Button variant="outline">Back to Messages</Button>
        </Link>
      </div>
    );
  }

  const progress =
    campaign.totalRecipients > 0
      ? Math.round((campaign.processedCount / campaign.totalRecipients) * 100)
      : 0;

  const isActive = ACTIVE_STATUSES.includes(campaign.status);

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <Link
          href="/dashboard/sms"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Messages
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {campaign.campaignName || "Untitled Campaign"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Created {timeAgo(campaign.createdAt)} · {campaign.encoding.toUpperCase()} ·{" "}
              {campaign.smsPartsPerMessage} part(s)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={campaign.status} />
            {isActive && (
              <Button
                variant="danger"
                size="md"
                onClick={handleCancel}
                isLoading={cancelling}
                className="gap-1.5"
              >
                <XCircle className="w-4 h-4" /> Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-600">Progress</span>
          <span className="text-sm font-bold text-slate-900">
            {campaign.processedCount}/{campaign.totalRecipients} ({progress}%)
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-extrabold text-green-600">{campaign.successCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">Sent</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-red-600">{campaign.failedCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">Failed</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-700">
              {campaign.totalRecipients - campaign.processedCount}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Remaining</p>
          </div>
        </div>
      </div>

      {/* Message preview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Message</h3>
        <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-xl p-4 border border-slate-100">
          {campaign.messageBody}
        </p>
      </div>

      {/* Jobs table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Recipients</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Recipient</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-left px-6 py-3 font-medium hidden sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-900">{job.recipient}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={job.status} />
                    {job.status === "failed" && job.failureReason && (
                      <p className="text-xs text-red-500 mt-1">{job.failureReason}</p>
                    )}
                  </td>
                  <td className="px-6 py-3 text-slate-500 hidden sm:table-cell">
                    {job.sentAt ? timeAgo(job.sentAt) : job.failedAt ? timeAgo(job.failedAt) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}