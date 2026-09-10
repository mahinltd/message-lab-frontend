"use client";

import React, { useEffect, useState } from "react";
import { Loader2, CreditCard, Clock, CheckCircle2, XCircle } from "lucide-react";
import { PlanCard } from "@/components/billing/PlanCard";
import { PaymentForm } from "@/components/billing/PaymentForm";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { BillingService } from "@/lib/billing";
import { PlanConfig, PaymentSubmission, Subscription } from "@/types";
import { formatDate, timeAgo } from "@/lib/utils";

export default function BillingPage() {
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState("free");
  const [payments, setPayments] = useState<PaymentSubmission[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlanConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [plansRes, subRes, payRes] = await Promise.all([
        BillingService.getPlans(),
        BillingService.getSubscription().catch(() => null),
        BillingService.getPayments(),
      ]);
      setPlans(plansRes || []);
      if (subRes?.subscription) setSubscription(subRes.subscription);
      if (subRes?.currentPlan?.planId) setCurrentPlanId(subRes.currentPlan.planId);
      setPayments(payRes || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      BillingService.getPlans(),
      BillingService.getSubscription().catch(() => null),
      BillingService.getPayments(),
    ])
      .then(([plansRes, subRes, payRes]) => {
        if (cancelled) return;
        setPlans(plansRes || []);
        if (subRes?.subscription) setSubscription(subRes.subscription);
        if (subRes?.currentPlan?.planId) setCurrentPlanId(subRes.currentPlan.planId);
        setPayments(payRes || []);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Current subscription */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Your Subscription</h2>
        {subscription ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Current Plan</p>
              <p className="text-2xl font-extrabold text-slate-900">{subscription.planName}</p>
              <p className="text-sm text-slate-500 mt-1">
                Started {formatDate(subscription.startedAt)} · Expires{" "}
                <span className="font-semibold text-slate-900">{formatDate(subscription.expiresAt)}</span>
              </p>
            </div>
            <StatusBadge status={subscription.status} />
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-500">Current Plan</p>
            <p className="text-2xl font-extrabold text-slate-900">Free</p>
            <p className="text-sm text-slate-500 mt-1">Upgrade below for higher limits.</p>
          </div>
        )}
      </div>

      {/* Plans */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-5">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <PlanCard
              key={p.planId}
              plan={p}
              isCurrentPlan={p.planId === currentPlanId}
              onSelect={setSelectedPlan}
            />
          ))}
        </div>
      </div>

      {/* Payment form */}
      {selectedPlan && (
        <PaymentForm
          plan={selectedPlan}
          onSuccess={() => {
            setSelectedPlan(null);
            load();
          }}
          onCancel={() => setSelectedPlan(null)}
        />
      )}

      {/* Payment history */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Payment History</h3>
        </div>

        {payments.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">No payments yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Your payment submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {payments.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 uppercase">
                      {p.paymentMethod}
                    </p>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ৳{p.amount} · {p.planId} · {timeAgo(p.createdAt)}
                  </p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    TXN: {p.transactionId}
                  </p>
                  {p.status === "rejected" && p.rejectionReason && (
                    <p className="text-xs text-red-600 mt-1">
                      Rejected: {p.rejectionReason}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {p.status === "approved" && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {p.status === "rejected" && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  {(p.status === "pending" || p.status === "under_review") && (
                    <Clock className="w-5 h-5 text-amber-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}