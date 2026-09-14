import { api } from "@/lib/api";
import { PlanUpsertInput } from "@/types";

const ADMIN_CACHE_TTL_MS = 30_000;
const adminCache = new Map<string, { expiresAt: number; value: unknown }>();
const adminInFlight = new Map<string, Promise<unknown>>();
// Existing AdminService callers rely on endpoint-specific response shapes.
// The cache remains generic while preserving those established caller types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminData = any;

function adminGet<T = AdminData>(path: string, params?: Record<string, unknown>): Promise<T> {
  const key = `${path}?${JSON.stringify(params || {})}`;
  const cached = adminCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.value as T);

  const existing = adminInFlight.get(key);
  if (existing) return existing as Promise<T>;

  const request = api.get(path, { params }).then((res) => {
    const value = res.data.data as T;
    adminCache.set(key, { expiresAt: Date.now() + ADMIN_CACHE_TTL_MS, value });
    return value;
  }).finally(() => adminInFlight.delete(key));
  adminInFlight.set(key, request);
  return request;
}

export function clearAdminCache(): void {
  adminCache.clear();
}

export class AdminService {
  static async revalidatePublicContent(): Promise<void> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
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
    return adminGet("/admin/users", params);
  }

  static async getUserStats() {
    return adminGet("/admin/users/stats");
  }

  static async getRecentUsers() {
    return adminGet("/admin/users/recent");
  }

  static async getUser(userId: string) {
    return adminGet(`/admin/users/${userId}`);
  }

  static async updateUserRole(userId: string, role: "user" | "admin") {
    const res = await api.patch(`/admin/users/${userId}/role`, { role });
    clearAdminCache();
    return res.data;
  }

  static async updateUserStatus(userId: string, isDisabled: boolean, reason?: string) {
    const res = await api.patch(`/admin/users/${userId}/status`, { isDisabled, reason });
    clearAdminCache();
    return res.data;
  }

  static async verifyUserEmail(userId: string) {
    const res = await api.post(`/admin/users/${userId}/verify-email`);
    clearAdminCache();
    return res.data;
  }

  /* ---------- Payments ---------- */
  static async getPayments(params?: { page?: number; limit?: number; status?: string }) {
    return adminGet("/admin/payments", params);
  }

  static async getPaymentStats() {
    return adminGet("/admin/payments/stats");
  }

  static async reviewPayment(data: {
    paymentId: string;
    action: "approve" | "reject";
    reviewNote?: string;
    rejectionReason?: string;
    subscriptionDurationDays?: number;
  }) {
    const res = await api.post("/admin/payments/review", data);
    clearAdminCache();
    return res.data;
  }

  /* ---------- Content ---------- */
  static async getContent(params?: { category?: string }) {
    return adminGet("/admin/content", params);
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
    clearAdminCache();
    return res.data;
  }

  static async deleteContent(key: string) {
    const res = await api.delete(`/admin/content/${key}`);
    clearAdminCache();
    return res.data;
  }

  /* ---------- Plans ---------- */
  static async getPlans(includeInactive?: boolean) {
    return adminGet("/admin/plans", { includeInactive });
  }

  static async upsertPlan(data: PlanUpsertInput) {
    const res = await api.post("/admin/plans", data);
    clearAdminCache();
    return res.data;
  }

  static async togglePlan(planId: string) {
    const res = await api.patch(`/admin/plans/${planId}/toggle`);
    clearAdminCache();
    return res.data;
  }

  /* ---------- Settings ---------- */
  static async getSettings(category?: string) {
    return adminGet("/admin/settings", { category });
  }

  static async upsertSetting(data: {
    key: string;
    value: unknown;
    valueType?: string;
    description?: string | null;
    category: string;
  }) {
    const res = await api.post("/admin/settings", data);
    clearAdminCache();
    return res.data;
  }

  /* ---------- Security ---------- */
  static async getAuditLogs(params?: { page?: number; limit?: number }) {
    return adminGet("/admin/security/audit-logs", params);
  }

  static async getSecurityEvents(params?: { page?: number; limit?: number }) {
    return adminGet("/admin/security/security-events", params);
  }

  /* ---------- Jobs ---------- */
  static async getJobs() {
    return adminGet("/admin/jobs");
  }

  static async getJobLogs(limit?: number) {
    return adminGet("/admin/jobs/logs", { limit });
  }

  static async triggerJob(jobName: string) {
    const res = await api.post(`/admin/jobs/${jobName}/trigger`);
    clearAdminCache();
    return res.data;
  }
}