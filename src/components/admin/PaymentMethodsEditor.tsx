"use client";

import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { AdminService } from "@/lib/admin";
import { getApiErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PaymentMethodType } from "@/lib/billing";

type PaymentMethodKey = "bkash" | "nagad" | "rocket";

type PaymentMethodForm = Record<PaymentMethodKey, {
  number: string;
  type: PaymentMethodType;
}> & {
  instructions: string;
};

const METHOD_LABELS: Record<PaymentMethodKey, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  rocket: "Rocket",
};

const EMPTY_FORM: PaymentMethodForm = {
  bkash: { number: "", type: "Personal" },
  nagad: { number: "", type: "Personal" },
  rocket: { number: "", type: "Personal" },
  instructions: "",
};

const METHOD_KEYS: PaymentMethodKey[] = ["bkash", "nagad", "rocket"];
const NUMBER_PATTERN = /^(?:01\d{9}|\+8801\d{9})$/;

function settingValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function PaymentMethodsEditor() {
  const [form, setForm] = useState<PaymentMethodForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    AdminService.getSettings("payment")
      .then((data) => {
        if (cancelled) return;

        const next = { ...EMPTY_FORM };
        for (const setting of data.settings || []) {
          const value = settingValue(setting.value);
          if (setting.key === "payment_instructions") {
            next.instructions = value;
            continue;
          }

          for (const method of METHOD_KEYS) {
            if (setting.key === `payment_${method}_number`) {
              next[method].number = value;
            } else if (setting.key === `payment_${method}_type`) {
              next[method].type = value === "Merchant" ? "Merchant" : "Personal";
            }
          }
        }
        setForm(next);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const updateMethod = (method: PaymentMethodKey, field: "number" | "type", value: string) => {
    setForm((current) => ({
      ...current,
      [method]: {
        ...current[method],
        [field]: value,
      },
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      for (const method of METHOD_KEYS) {
        await AdminService.upsertSetting({
          key: `payment_${method}_number`,
          value: form[method].number,
          valueType: "string",
          description: null,
          category: "payment",
        });
        await AdminService.upsertSetting({
          key: `payment_${method}_type`,
          value: form[method].type,
          valueType: "string",
          description: null,
          category: "payment",
        });
      }

      await AdminService.upsertSetting({
        key: "payment_instructions",
        value: form.instructions,
        valueType: "string",
        description: null,
        category: "payment",
      });
      toast.success("Payment methods saved");
      void AdminService.revalidatePublicContent().catch(() => undefined);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to save payment methods"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-6">
        <h3 className="text-base font-bold text-slate-900">Payment Methods</h3>
        <p className="mt-1 text-sm text-slate-500">
          These numbers are shown to users on the payment form. Applies to all plans.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4" aria-label="Loading payment methods">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-12 animate-pulse rounded-xl bg-slate-100" />
          ))}
          <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
        </div>
      ) : (
        <div className="space-y-5">
          {METHOD_KEYS.map((method) => {
            const number = form[method].number;
            const invalidNumber = number.length > 0 && !NUMBER_PATTERN.test(number);

            return (
              <div key={method} className="grid gap-3 sm:grid-cols-[1fr_180px] sm:items-start">
                <div>
                  <Input
                    id={`payment-${method}-number`}
                    label={`${METHOD_LABELS[method]} Number`}
                    value={number}
                    placeholder="01712345678"
                    onChange={(event) => updateMethod(method, "number", event.target.value)}
                    helperText={invalidNumber ? "Use 01XXXXXXXXX or +8801XXXXXXXXX format, or leave empty." : undefined}
                  />
                </div>
                <div>
                  <label htmlFor={`payment-${method}-type`} className="mb-1.5 block text-sm font-medium text-slate-700">
                    Account Type
                  </label>
                  <select
                    id={`payment-${method}-type`}
                    value={form[method].type}
                    onChange={(event) => updateMethod(method, "type", event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Merchant">Merchant</option>
                  </select>
                </div>
              </div>
            );
          })}

          <div>
            <label htmlFor="payment-instructions" className="mb-1.5 block text-sm font-medium text-slate-700">
              Extra Instructions (Optional)
            </label>
            <textarea
              id="payment-instructions"
              value={form.instructions}
              onChange={(event) => setForm((current) => ({ ...current, instructions: event.target.value }))}
              rows={3}
              placeholder="Add any payment instructions shown to users."
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button type="button" size="md" className="gap-2" onClick={save} isLoading={saving}>
              <Save className="h-4 w-4" />
              Save Payment Methods
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
