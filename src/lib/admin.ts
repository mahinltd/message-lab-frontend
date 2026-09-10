import { api } from "@/lib/api";
import { PlanUpsertInput } from "@/types";

export class AdminService {
  static async revalidatePublicContent(): Promise<void> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET || "" }),
    });
  }
  /* ---------- Users ---------- */
  static async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isVerified?: string;
    isDisabled?: string;
  }) {
    const res = await api.get("/admin/users", { params });
    return res.data.data;
  }

  static async getUserStats() {
    const res = await api.get("/admin/users/stats");
    return res.data.data;
  }

  static async getRecentUsers() {
    const res = await api.get("/admin/users/recent");
    return res.data.data;
  }

  static async getUser(userId: string) {
    const res = await api.get(`/admin/users/${userId}`);
    return res.data.data;
  }

  static async updateUserRole(userId: string, role: "user" | "admin") {
    const res = await api.patch(`/admin/users/${userId}/role`, { role });
    return res.data;
  }

  static async updateUserStatus(userId: string, isDisabled: boolean, reason?: string) {
    const res = await api.patch(`/admin/users/${userId}/status`, { isDisabled, reason });
    return res.data;
  }

  static async verifyUserEmail(userId: string) {
    const res = await api.post(`/admin/users/${userId}/verify-email`);
    return res.data;
  }

  /* ---------- Payments ---------- */
  static async getPayments(params?: { page?: number; limit?: number; status?: string }) {
    const res = await api.get("/admin/payments", { params });
    return res.data.data;
  }

  static async getPaymentStats() {
    const res = await api.get("/admin/payments/stats");
    return res.data.data;
  }

  static async reviewPayment(data: {
    paymentId: string;
    action: "approve" | "reject";
    reviewNote?: string;
    rejectionReason?: string;
    subscriptionDurationDays?: number;
  }) {
    const res = await api.post("/admin/payments/review", data);
    return res.data;
  }

  /* ---------- Content ---------- */
  static async getContent(params?: { category?: string }) {
    const res = await api.get("/admin/content", { params });
    return res.data.data;
  }

  static async upsertContent(data: {
    key: string;
    category: string;
    title?: string | null;
    body?: string | null;
    metadata?: Record<string, unknown>;
    isActive?: boolean;
  }) {
    const res = await api.post("/admin/content", data);
    return res.data;
  }

  static async deleteContent(key: string) {
    const res = await api.delete(`/admin/content/${key}`);
    return res.data;
  }

  /* ---------- Plans ---------- */
  static async getPlans(includeInactive?: boolean) {
    const res = await api.get("/admin/plans", { params: { includeInactive } });
    return res.data.data;
  }

  static async upsertPlan(data: PlanUpsertInput) {
    const res = await api.post("/admin/plans", data);
    return res.data;
  }

  static async togglePlan(planId: string) {
    const res = await api.patch(`/admin/plans/${planId}/toggle`);
    return res.data;
  }

  /* ---------- Settings ---------- */
  static async getSettings(category?: string) {
    const res = await api.get("/admin/settings", { params: { category } });
    return res.data.data;
  }

  static async upsertSetting(data: {
    key: string;
    value: unknown;
    valueType?: string;
    description?: string | null;
    category: string;
  }) {
    const res = await api.post("/admin/settings", data);
    return res.data;
  }

  /* ---------- Security ---------- */
  static async getAuditLogs(params?: { page?: number; limit?: number }) {
    const res = await api.get("/admin/security/audit-logs", { params });
    return res.data.data;
  }

  static async getSecurityEvents(params?: { page?: number; limit?: number }) {
    const res = await api.get("/admin/security/security-events", { params });
    return res.data.data;
  }

  /* ---------- Jobs ---------- */
  static async getJobs() {
    const res = await api.get("/admin/jobs");
    return res.data.data;
  }

  static async getJobLogs(limit?: number) {
    const res = await api.get("/admin/jobs/logs", { params: { limit } });
    return res.data.data;
  }

  static async triggerJob(jobName: string) {
    const res = await api.post(`/admin/jobs/${jobName}/trigger`);
    return res.data;
  }
}