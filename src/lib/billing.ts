import { api } from "@/lib/api";
import type { PaymentSubmission, PlanConfig } from "@/types";

const BILLING_CACHE_TTL_MS = 30_000;
const billingCache = new Map<string, { expiresAt: number; value: unknown }>();
const billingInFlight = new Map<string, Promise<unknown>>();
// Existing BillingService callers rely on endpoint-specific response shapes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BillingData = any;

function billingGet<T = BillingData>(path: string): Promise<T> {
  const cached = billingCache.get(path);
  if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.value as T);
  const existing = billingInFlight.get(path);
  if (existing) return existing as Promise<T>;
  const request = api.get(path).then((res) => {
    const value = res.data.data as T;
    billingCache.set(path, { expiresAt: Date.now() + BILLING_CACHE_TTL_MS, value });
    return value;
  }).finally(() => billingInFlight.delete(path));
  billingInFlight.set(path, request);
  return request;
}

export function clearBillingCache(): void {
  billingCache.clear();
}

export type PaymentMethodType = "Personal" | "Merchant";

export interface PaymentMethodDetails {
  number: string;
  type: PaymentMethodType;
}

export interface PaymentMethods {
  bkash: PaymentMethodDetails;
  nagad: PaymentMethodDetails;
  rocket: PaymentMethodDetails;
  instructions: string;
}

export class BillingService {
  static async getPaymentMethods(): Promise<PaymentMethods> {
    const res = await api.get("/public/payment-methods");
    return res.data.data;
  }

  static async getSubscription() {
    return billingGet("/payments/subscription");
  }

  static async getPlans() {
    const data = await billingGet<PlanConfig[] | { plans: PlanConfig[] }>("/payments/plans");
    return Array.isArray(data) ? data : data.plans;
  }

  static async submitPayment(data: {
    planId: string;
    paymentMethod: "bkash" | "nagad" | "rocket";
    senderNumber: string;
    transactionId: string;
    amount: number;
    note?: string;
  }) {
    const res = await api.post("/payments/submit", data);
    return res.data.data;
  }

  static async getPayments() {
    const data = await billingGet<PaymentSubmission[] | { payments: PaymentSubmission[] }>("/payments");
    return Array.isArray(data) ? data : data.payments;
  }

  static async getPayment(id: string) {
    const res = await api.get(`/payments/${id}`);
    return res.data.data.payment;
  }
}