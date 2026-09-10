"use client";

import React, { useEffect, useState } from "react";
import { Loader2, ShieldAlert, FileText } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Pagination } from "@/components/ui/pagination";
import { AdminService } from "@/lib/admin";
import { timeAgo } from "@/lib/utils";
import { AdminAuditLog, AdminSecurityEvent } from "@/types";
import { cn } from "@/lib/utils";

type Tab = "audit" | "events";

const severityBadge: Record<string, string> = {
  low: "pending",
  medium: "under_review",
  high: "partially_failed",
  critical: "failed",
};

export default function AdminSecurityPage() {
  const [tab, setTab] = useState<Tab>("audit");
  const [audit, setAudit] = useState<AdminAuditLog[]>([]);
  const [events, setEvents] = useState<AdminSecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const request = tab === "audit"
      ? AdminService.getAuditLogs({ page, limit: 20 })
      : AdminService.getSecurityEvents({ page, limit: 20 });
    request
      .then((data) => {
        if (cancelled) return;
        if (tab === "audit") setAudit(data.logs || data.items || []);
        else setEvents(data.events || data.items || []);
        setPages(data.pagination?.pages || 1);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [tab, page]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Security Logs</h2>
        <p className="text-sm text-slate-500 mt-1">Monitor audit trails and security events.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => { setTab("audit"); setPage(1); }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
            tab === "audit" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          )}
        >
          <FileText className="w-4 h-4" /> Audit Logs
        </button>
        <button
          onClick={() => { setTab("events"); setPage(1); }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
            tab === "events" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          )}
        >
          <ShieldAlert className="w-4 h-4" /> Security Events
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-indigo-600" /></div>
        ) : tab === "audit" ? (
          audit.length === 0 ? (
            <p className="px-6 py-16 text-center text-sm text-slate-500">No audit logs</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium">Action</th>
                      <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Entity</th>
                      <th className="text-left px-6 py-3 font-medium hidden lg:table-cell">IP</th>
                      <th className="text-left px-6 py-3 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {audit.map((l) => (
                      <tr key={l._id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 font-medium text-slate-900">{l.action}</td>
                        <td className="px-6 py-3 text-slate-600 hidden md:table-cell">{l.entityType}</td>
                        <td className="px-6 py-3 font-mono text-xs text-slate-500 hidden lg:table-cell">{l.ipAddress || "—"}</td>
                        <td className="px-6 py-3 text-slate-500">{timeAgo(l.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} pages={pages} onPageChange={setPage} />
            </>
          )
        ) : events.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-slate-500">No security events</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Event</th>
                    <th className="text-left px-6 py-3 font-medium">Severity</th>
                    <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Description</th>
                    <th className="text-left px-6 py-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map((e) => (
                    <tr key={e._id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-slate-900">{e.eventType}</td>
                      <td className="px-6 py-3"><StatusBadge status={severityBadge[e.severity] || "pending"} /></td>
                      <td className="px-6 py-3 text-slate-600 hidden md:table-cell max-w-xs truncate">{e.description}</td>
                      <td className="px-6 py-3 text-slate-500">{timeAgo(e.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pages={pages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}