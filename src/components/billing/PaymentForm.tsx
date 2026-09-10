"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Wallet, CreditCard, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BillingService, PaymentMethods } from "@/lib/billing";
import { PlanConfig } from "@/types";
import { getApiErrorMessage } from "@/lib/utils";

const paymentSchema = z.object({
  paymentMethod: z.enum(["bkash", "nagad", "rocket"], {
    errorMap: () => ({ message: "Please select a payment method" }),
  }),
  senderNumber: z
    .string()
    .min(11, "Enter a valid mobile number")
    .max(15)
    .regex(/^[0-9+]+$/, "Only digits allowed"),
  transactionId: z
    .string()
    .min(4, "Transaction ID too short")
    .max(50, "Transaction ID too long")
    .trim(),
  note: z.string().max(500).optional().or(z.literal("")),
});

type FormInput = z.infer<typeof paymentSchema>;

const METHOD_COLORS = {
  bkash: "bg-pink-500 text-white border-pink-500",
  nagad: "bg-orange-500 text-white border-orange-500",
  rocket: "bg-purple-500 text-white border-purple-500",
};

interface PaymentFormProps {
  plan: PlanConfig;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ plan, onSuccess, onCancel }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods | null>(null);
  const [copied, setCopied] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { paymentMethod: "bkash" },
  });

  const selected = useWatch({ control, name: "paymentMethod" });
  const selectedMethod = paymentMethods?.[selected];
  const receiverNumber = selectedMethod?.number || "";
  const isConfigured = receiverNumber.length > 0;

  useEffect(() => {
    let cancelled = false;

    BillingService.getPaymentMethods()
      .then((methods) => {
        if (!cancelled) setPaymentMethods(methods);
      })
      .catch(() => {
        if (!cancelled) setPaymentMethods(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const copyReceiverNumber = async () => {
    if (!receiverNumber) return;

    try {
      await navigator.clipboard.writeText(receiverNumber);
      setCopied(true);
      toast.success("Payment number copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Unable to copy payment number");
    }
  };

  const onSubmit = async (data: FormInput) => {
    if (!isConfigured) {
      toast.error(`Payment number for ${data.paymentMethod} is not configured yet.`);
      return;
    }

    setIsLoading(true);
    try {
      await BillingService.submitPayment({
        planId: plan.planId,
        paymentMethod: data.paymentMethod,
        senderNumber: data.senderNumber,
        transactionId: data.transactionId,
        amount: plan.priceMonthly,
        note: data.note,
      });
      toast.success("Payment submitted! Admin will review it shortly.");
      onSuccess();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Payment submission failed."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Upgrade to {plan.displayName}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            ৳{plan.priceMonthly}/month · Send payment via {selected?.toUpperCase()}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Method selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["bkash", "nagad", "rocket"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setValue("paymentMethod", m, { shouldValidate: true })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                  selected === m
                    ? METHOD_COLORS[m]
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Wallet className="w-5 h-5" />
                <span className="capitalize">{m}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-900 mb-1">Steps:</p>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>Open your {selected} app</li>
            <li>
              Send ৳{plan.priceMonthly} to{" "}
              {isConfigured ? (
                <span className="inline-flex items-center gap-2 align-middle">
                  <span className="font-mono font-bold text-indigo-600">{receiverNumber}</span>
                  <button
                    type="button"
                    onClick={copyReceiverNumber}
                    className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-indigo-600 hover:bg-indigo-50"
                    aria-label={`Copy ${selected} payment number`}
                    title="Copy payment number"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </span>
              ) : (
                <span className="font-mono font-semibold">Not configured</span>
              )}
            </li>
            <li>Copy the transaction ID and paste below</li>
          </ol>
          {isConfigured && (
            <span className="mt-3 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
              {selectedMethod?.type} account
            </span>
          )}
          {!isConfigured && (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
              Payment number for {selected?.toUpperCase()} is not configured yet. Please choose another method or try again later.
            </p>
          )}
          {paymentMethods?.instructions && (
            <p className="mt-3 border-t border-slate-200 pt-3 whitespace-pre-line">
              {paymentMethods.instructions}
            </p>
          )}
        </div>

        <Input
          id="sender"
          label="Your Sender Number"
          placeholder="01711111111"
          error={errors.senderNumber?.message}
          {...register("senderNumber")}
        />

        <Input
          id="txn"
          label="Transaction ID"
          placeholder="e.g. TXN9AB8CD7"
          error={errors.transactionId?.message}
          {...register("transactionId")}
        />

        <Input
          id="note"
          label="Note (Optional)"
          placeholder="Any additional info"
          error={errors.note?.message}
          {...register("note")}
        />

        <Button type="submit" variant="primary" size="lg" className="w-full gap-2" isLoading={isLoading} disabled={!isConfigured}>
          <CreditCard className="w-4 h-4" />
          Submit Payment for Review
        </Button>
      </form>
    </div>
  );
}