"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Play, Timer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AdminService } from "@/lib/admin";
import { timeAgo } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [j, l] = await Promise.all([
        AdminService.getJobs(),
        AdminService.getJobLogs(15),
      ]);
      setJobs(j.jobs || []);
      setLogs(l.logs || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const trigger = async (name: string) => {
    setTriggering(name);
    try {
      const res = await AdminService.triggerJob(name);
      toast.success(res?.message || `Job "${name}" triggered`);
      setTimeout(load, 1000);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Trigger failed");
    } finally {
      setTriggering(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Scheduled Jobs</h2>
          <p className="text-sm text-slate-500 mt-1">Background tasks running on the server.</p>
        </div>
        <Button variant="outline" size="md" className="gap-2" onClick={load}>
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-indigo-600" /></div>
      ) : (
        <>
          {/* Jobs grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <div key={job.name} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Timer className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-mono">{job.name}</h3>
                      <p className="text-xs text-slate-500">
                        {job.isRunning ? "Running now" : job.lastExecution ? `Last: ${timeAgo(job.lastExecution.startedAt)}` : "Never run"}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={job.isRunning ? "processing" : job.lastExecution?.result?.success ? "active" : "pending"} />
                </div>
                {job.lastExecution?.result && (
                  <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 mb-3">
                    {job.lastExecution.result.message}
                    {job.lastExecution.result.affectedCount != null && (
                      <span className="font-semibold text-slate-700"> ({job.lastExecution.result.affectedCount} affected)</span>
                    )}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5"
                  onClick={() => trigger(job.name)}
                  isLoading={triggering === job.name}
                >
                  <Play className="w-3.5 h-3.5" /> Run Now
                </Button>
              </div>
            ))}
          </div>

          {/* Recent logs */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Recent Executions</h3>
            </div>
            {logs.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-slate-500">No executions yet</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {logs.map((log, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 font-mono">{log.jobName}</p>
                      <p className="text-xs text-slate-500">
                        {log.result?.message || "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <StatusBadge status={log.result?.success ? "active" : "failed"} />
                      <span className="text-xs text-slate-400">{timeAgo(log.startedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}