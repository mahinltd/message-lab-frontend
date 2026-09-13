// ============================================
// MessageLab - TypeScript Type Definitions
// ============================================

// --- User Types ---
export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  role: "user" | "admin";
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  profilePicture: string | null;
  authProviders?: {
    local: boolean;
    google: boolean;
  };
  createdAt?: string;
  lastLoginAt?: string | null;
}

// --- Auth Types ---
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken?: string;
    requiresVerification?: boolean;
  };
}

export interface RegisterInput {
  name: string;
  email: string;
  mobile?: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// --- Device Types ---
export interface Device {
  _id: string;
  deviceId?: string;
  androidDeviceId?: string;
  userId: string;
  deviceName: string;
  deviceModel: string | null;
  androidVersion: string | null;
  appVersion: string | null;
  status: "active" | "offline" | "disabled" | "suspended";
  lastHeartbeat: DeviceHeartbeat | null;
  lastSeenAt: string | null;
  connectedAt: string;
}

export interface DeviceHeartbeat {
  batteryLevel?: number;
  isCharging?: boolean;
  networkType?: string;
  hasSim?: boolean;
  smsPermissionGranted?: boolean;
  isSmsCapable?: boolean;
  appVersion?: string;
  lastSeenAt: string;
}

export interface PairingCodeResponse {
  code: string;
  qrCodeDataUrl: string;
  expiresAt: string;
  expiresInMinutes: number;
}

// --- SMS Types ---
export interface SmsCampaign {
  _id: string;
  userId: string;
  deviceId: string;
  campaignName: string | null;
  messageBody: string;
  totalRecipients: number;
  processedCount: number;
  successCount: number;
  failedCount: number;
  status: CampaignStatus;
  planAtCreation: string;
  minDelayMs: number;
  smsPartsPerMessage: number;
  encoding: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export type CampaignStatus =
  | "queued"
  | "processing"
  | "paused"
  | "completed"
  | "partially_failed"
  | "failed"
  | "cancelled";

export interface SmsJob {
  _id: string;
  campaignId: string;
  recipient: string;
  originalRecipient: string;
  status: JobStatus;
  failureReason: string | null;
  attempts: number;
  smsParts: number;
  sentAt: string | null;
  failedAt: string | null;
  createdAt: string;
}

export type JobStatus =
  | "queued"
  | "assigned"
  | "processing"
  | "sending"
  | "sent"
  | "failed"
  | "cancelled";

// --- Payment Types ---
export interface PaymentSubmission {
  _id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  paymentMethod: "bkash" | "nagad" | "rocket";
  senderNumber: string;
  transactionId: string;
  status: PaymentStatus;
  rejectionReason: string | null;
  createdAt: string;
}

export type PaymentStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "expired";

// --- Subscription Types ---
export interface Subscription {
  _id: string;
  userId: string;
  planId: string;
  planName: string;
  status: "active" | "expired" | "cancelled" | "suspended";
  startedAt: string;
  expiresAt: string;
}

export interface PlanConfig {
  planId: string;
  displayName: string;
  description: string | null;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  maxRecipientsPerCampaign: number;
  maxDailyMessages: number;
  maxDevices: number;
  minSmsDelayMs: number;
  apiAccess?: boolean;
  otpEnabled?: boolean;
  maxDailyOtpRequests?: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

// --- Content Types ---
export interface SiteContentItem {
  title: string | null;
  body: string | null;
  metadata?: Record<string, unknown>;
}

export interface PageContent {
  hero: Record<string, SiteContentItem>;
  header: Record<string, SiteContentItem>;
  footer: Record<string, SiteContentItem>;
  legal: Record<string, SiteContentItem>;
  pages: Record<string, SiteContentItem>;
  announcement: SiteContentItem | null;
  features: Array<{
    key: string;
    title: string | null;
    body: string | null;
    metadata?: Record<string, unknown>;
  }>;
  pricing: {
    sectionContent: Record<string, SiteContentItem>;
    plans: PlanConfig[];
  };
}

// --- API Response Types ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AdminUser extends Omit<User, "id" | "createdAt"> {
  _id: string;
  createdAt: string;
  isAccountDisabled: boolean;
}

export interface AdminPayment extends Omit<PaymentSubmission, "userId"> {
  userId: Pick<User, "name" | "email">;
}

export interface AdminContentItem extends SiteContentItem {
  _id?: string;
  key: string;
  category: string;
  isActive?: boolean;
}

export interface AdminSetting {
  _id?: string;
  key: string;
  value: unknown;
  valueType: string;
  description?: string | null;
  category: string;
}

export interface PlanUpsertInput {
  planId: string;
  name?: string;
  displayName: string;
  description?: string | null;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  maxRecipientsPerCampaign: number;
  maxDailyMessages: number;
  maxDevices: number;
  minSmsDelayMs: number;
  apiAccess?: boolean;
  otpEnabled?: boolean;
  maxDailyOtpRequests?: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface AdminJob {
  name: string;
  isRunning: boolean;
  lastExecution?: {
    startedAt: string;
    result?: { success: boolean; message?: string; affectedCount?: number };
  };
}

export interface AdminJobLog {
  jobName: string;
  startedAt: string;
  result?: { success: boolean; message?: string };
}

export interface AdminAuditLog {
  _id: string;
  action: string;
  createdAt: string;
  user?: Pick<User, "name" | "email">;
  details?: Record<string, unknown>;
  entityType?: string;
  ipAddress?: string;
}

export interface AdminSecurityEvent {
  _id: string;
  type: string;
  createdAt: string;
  details?: Record<string, unknown>;
  eventType: string;
  severity: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
