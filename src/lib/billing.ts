import { api } from "@/lib/api";

export class BillingService {
  static async getSubscription() {
    const res = await api.get("/payments/subscription");
    return res.data.data;
  }

  static async getPlans() {
    const res = await api.get("/payments/plans");
    return res.data.data.plans;
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
    const res = await api.get("/payments");
    return res.data.data.payments;
  }

  static async getPayment(id: string) {
    const res = await api.get(`/payments/${id}`);
    return res.data.data.payment;
  }
}