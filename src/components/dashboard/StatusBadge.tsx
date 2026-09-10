import React from "react";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  active: "bg-green-50 text-green-700 ring-green-600/20",
  offline: "bg-slate-100 text-slate-600 ring-slate-500/20",
  paused: "bg-amber-50 text-amber-700 ring-amber-600/20",
  disabled: "bg-red-50 text-red-700 ring-red-600/20",
  suspended: "bg-red-50 text-red-700 ring-red-600/20",
  completed: "bg-green-50 text-green-700 ring-green-600/20",
  processing: "bg-blue-50 text-blue-700 ring-blue-600/20",
  queued: "bg-slate-100 text-slate-600 ring-slate-500/20",
  partially_failed: "bg-amber-50 text-amber-700 ring-amber-600/20",
  failed: "bg-red-50 text-red-700 ring-red-600/20",
  cancelled: "bg-slate-100 text-slate-500 ring-slate-500/20",
  sent: "bg-green-50 text-green-700 ring-green-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  under_review: "bg-blue-50 text-blue-700 ring-blue-600/20",
  approved: "bg-green-50 text-green-700 ring-green-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
  expired: "bg-slate-100 text-slate-500 ring-slate-500/20",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = status.replace(/_/g, " ");
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ring-1 ring-inset",
        styles[status] || styles.queued,
        className
      )}
    >
      {label}
    </span>
  );
}