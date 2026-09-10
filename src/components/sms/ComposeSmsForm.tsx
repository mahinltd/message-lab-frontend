"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send, Users, MessageSquare, AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmsService } from "@/lib/sms";
import { parseRecipients, calculateSmsParts, cn, getApiErrorMessage } from "@/lib/utils";

interface ComposeSmsFormProps {
  maxRecipients: number;
}

type Mode = "single" | "bulk";

export function ComposeSmsForm({ maxRecipients }: ComposeSmsFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("single");
  const [singleRecipient, setSingleRecipient] = useState("");
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const bulkParsed = useMemo(() => parseRecipients(recipients), [recipients]);
  const singleParsed = useMemo(() => parseRecipients(singleRecipient), [singleRecipient]);
  const parsed = mode === "single" ? singleParsed : bulkParsed;

  const parts = useMemo(() => calculateSmsParts(message), [message]);
  const totalParts = parsed.valid.length * parts;
  const overLimit = parsed.valid.length > maxRecipients;
  const estimatedSeconds = parsed.valid.length * 4;

  const canSubmit =
    parsed.valid.length > 0 &&
    !overLimit &&
    message.trim().length > 0 &&
    !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      const result = await SmsService.sendBulk({
        campaignName:
          campaignName.trim() || (mode === "single" ? "Single Message" : undefined),
        recipients: parsed.valid.join(","),
        messageBody: message,
      });
      toast.success(
        mode === "single" ? "Message queued for sending!" : "Campaign created and queued!"
      );
      router.push(`/dashboard/sms/${result.campaignId}`);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to send."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setMode("single")}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            mode === "single" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <User className="w-4 h-4" /> Single
        </button>
        <button
          type="button"
          onClick={() => setMode("bulk")}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            mode === "bulk" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <Users className="w-4 h-4" /> Bulk
        </button>
      </div>

      {/* Campaign name (bulk only) */}
      {mode === "bulk" && (
        <Input
          id="campaign-name"
          label="Campaign Name (Optional)"
          placeholder="Eid Greetings"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
      )}

      {/* Recipients */}
      {mode === "single" ? (
        <div>
          <Input
            id="single-recipient"
            label="Recipient Number"
            placeholder="01711111111"
            value={singleRecipient}
            onChange={(e) => setSingleRecipient(e.target.value)}
          />
          <div className="mt-2 flex items-center gap-3 text-xs">
            {singleRecipient.trim() && (
              parsed.valid.length > 0 ? (
                <span className="text-green-600 font-medium">✓ Valid: {parsed.valid[0]}</span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="w-3.5 h-3.5" /> Invalid number
                </span>
              )
            )}
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Recipients</label>
          <textarea
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="01711111111, 01822222222, +8801933333333"
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-600">
              <Users className="w-3.5 h-3.5" />
              <span className="font-semibold text-slate-900">{parsed.valid.length}</span> valid
            </span>
            {parsed.invalid.length > 0 && (
              <span className="flex items-center gap-1 text-red-600">
                <AlertCircle className="w-3.5 h-3.5" /> {parsed.invalid.length} invalid
              </span>
            )}
            {parsed.duplicates.length > 0 && (
              <span className="text-amber-600">{parsed.duplicates.length} duplicates removed</span>
            )}
            <span className="ml-auto text-slate-500">Limit: {maxRecipients}</span>
          </div>
          {overLimit && (
            <p className="mt-1.5 text-xs text-red-600">
              You have {parsed.valid.length} recipients but your plan allows {maxRecipients}.
            </p>
          )}
        </div>
      )}

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={5}
          maxLength={2000}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            {parts} SMS part{parts > 1 ? "s" : ""}
          </span>
          <span>{message.length}/2000</span>
        </div>
      </div>

      {/* Summary */}
      {parsed.valid.length > 0 && message.trim() && (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-600">Recipients</span>
            <span className="font-semibold text-slate-900">{parsed.valid.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Total SMS parts</span>
            <span className="font-semibold text-slate-900">{totalParts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Estimated time</span>
            <span className="font-semibold text-slate-900">~{estimatedSeconds}s</span>
          </div>
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full gap-2" disabled={!canSubmit} isLoading={isLoading}>
        <Send className="w-4 h-4" />
        {isLoading ? "Sending..." : mode === "single" ? "Send Message" : "Send Campaign"}
      </Button>
    </form>
  );
}