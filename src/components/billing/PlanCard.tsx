import React from "react";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PlanConfig } from "@/types";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: PlanConfig;
  isCurrentPlan: boolean;
  onSelect: (plan: PlanConfig) => void;
}

export function PlanCard({ plan, isCurrentPlan, onSelect }: PlanCardProps) {
  const isPro = plan.planId === "pro";
  const isFree = plan.priceMonthly === 0;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl bg-white p-6 border transition-all",
        isPro && !isCurrentPlan
          ? "border-indigo-500 shadow-lg shadow-indigo-100 ring-1 ring-indigo-500"
          : isCurrentPlan
          ? "border-green-500 shadow-sm"
          : "border-slate-200 hover:border-slate-300"
      )}
    >
      {isPro && !isCurrentPlan && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow">
          <Star className="w-3 h-3 fill-current" /> Most Popular
        </span>
      )}

      <div className="flex items-start justify-between">
        <h3 className="text-lg font-bold text-slate-900">{plan.displayName}</h3>
        {isCurrentPlan && <StatusBadge status="active" />}
      </div>

      {plan.description && (
        <p className="mt-1.5 text-sm text-slate-500">{plan.description}</p>
      )}

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-sm text-slate-500">৳</span>
        <span className="text-3xl font-extrabold text-slate-900">{plan.priceMonthly}</span>
        <span className="text-sm text-slate-500">/month</span>
      </div>

      <ul className="mt-5 space-y-2.5 flex-1">
        {plan.features.map((f: string) => (
          <li key={f} className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-2.5 h-2.5 text-green-600" />
            </span>
            <span className="text-sm text-slate-700">{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {isCurrentPlan ? (
          <Button variant="secondary" size="md" className="w-full" disabled>
            Current Plan
          </Button>
        ) : isFree ? (
          <Button variant="outline" size="md" className="w-full" disabled>
            Already Free
          </Button>
        ) : (
          <Button variant="primary" size="md" className="w-full" onClick={() => onSelect(plan)}>
            {isCurrentPlan ? "Current" : "Upgrade"}
          </Button>
        )}
      </div>
    </div>
  );
}