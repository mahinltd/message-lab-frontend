"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Loader2, CheckCircle2, XCircle, Wallet } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Pagination } from "@/components/ui/pagination";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminService } from "@/lib/admin";
import { toast } from "sonner";
import { AdminPayment } from "@/types";
import { getApiErrorMessage } from "@/lib/utils";
import { PaymentMethodsEditor } from "@/components/admin/PaymentMethodsEditor";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState("");

  const [selected, setSelected] = useState<AdminPayment | null>(null);
  const [action, setAction] = useState<"approve" | "reject">("approve");
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState(30);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await AdminService.getPayments({
        page,
        limit: 15,
        status: status || undefined,
      });
      setPayments(data.payments || []);
      setPages(data.pagination?.pages || 1);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    let cancelled = false;
    AdminService.getPayments({ page, limit: 15, status: status || undefined })
      .then((data) => {
        if (cancelled) return;
        setPayments(data.payments || []);
        setPages(data.pagination?.pages || 1);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [page, status]);

  const openReview = (p: AdminPayment, a: "approve" | "reject") => {
    setSelected(p);
    setAction(a);
    setNote("");
    setReason("");
    setDuration(30);
  };

  const submitReview = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      await AdminService.reviewPayment({
        paymentId: selected._id,
        action,
        reviewNote: note || undefined,
        rejectionReason:
          action === "reject" ? reason || "Payment could not be verified" : undefined,
        subscriptionDurationDays: action === "approve" ? duration : undefined,
      });
      toast.success(action === "approve" ? "Payment approved & subscription activated" : "Payment rejected");
      setSelected(null);
      load();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Review failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Payment Review</h2>
          <p className="text-sm text-slate-500 mt-1">Verify manual payments and activate subscriptions.</p>
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <PaymentMethodsEditor />

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-indigo-600" /></div>
        ) : payments.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">No payments found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">User</th>
                    <th className="text-left px-6 py-3 font-medium">Method</th>
                    <th className="text-left px-6 py-3 font-medium">Amount</th>
                    <th className="text-left px-6 py-3 font-medium hidden md:table-cell">TXN ID</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-right px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50">
                      <td className="px-6 py-3">
                        <p className="font-semibold text-slate-900">{p.userId?.name || "—"}</p>
                        <p className="text-xs text-slate-500">{p.userId?.email || ""}</p>
                      </td>
                      <td className="px-6 py-3 uppercase font-medium text-slate-700">{p.paymentMethod}</td>
                      <td className="px-6 py-3 font-semibold text-slate-900">৳{p.amount}</td>
                      <td className="px-6 py-3 font-mono text-xs text-slate-500 hidden md:table-cell">{p.transactionId}</td>
                      <td className="px-6 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-6 py-3">
                        {(p.status === "pending" || p.status === "under_review") && (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openReview(p, "approve")} className="p-1.5 rounded-lg text-green-600 hover:bg-green-50" title="Approve">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => openReview(p, "reject")} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50" title="Reject">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pages={pages} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Review modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={action === "approve" ? "Approve Payment" : "Reject Payment"}
      >
        {selected && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm space-y-1">
              <p><span className="text-slate-500">User:</span> <span className="font-semibold text-slate-900">{selected.userId?.name}</span></p>
              <p><span className="text-slate-500">Plan:</span> <span className="font-semibold text-slate-900 uppercase">{selected.planId}</span></p>
              <p><span className="text-slate-500">Amount:</span> <span className="font-semibold text-slate-900">৳{selected.amount}</span></p>
              <p><span className="text-slate-500">Method:</span> <span className="font-semibold text-slate-900 uppercase">{selected.paymentMethod}</span></p>
              <p><span className="text-slate-500">TXN:</span> <span className="font-mono text-slate-900">{selected.transactionId}</span></p>
              <p><span className="text-slate-500">Sender:</span> <span className="font-mono text-slate-900">{selected.senderNumber}</span></p>
            </div>

            {action === "approve" ? (
              <>
                <Input
                  id="duration"
                  type="number"
                  label="Subscription Duration (days)"
                  value={String(duration)}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                />
                <Input
                  id="note"
                  label="Review Note (Optional)"
                  placeholder="Verified via bKash app"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </>
            ) : (
              <>
                <Input
                  id="reason"
                  label="Rejection Reason"
                  placeholder="Transaction ID not found"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <Input
                  id="note"
                  label="Internal Note (Optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="md" className="flex-1" onClick={() => setSelected(null)}>
                Cancel
              </Button>
              <Button
                variant={action === "approve" ? "primary" : "danger"}
                size="md"
                className="flex-1"
                onClick={submitReview}
                isLoading={busy}
              >
                {action === "approve" ? "Approve & Activate" : "Reject Payment"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}