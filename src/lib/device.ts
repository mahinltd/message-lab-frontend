import { api } from "@/lib/api";
import { Device, PairingCodeResponse } from "@/types";

export interface ResumeCodeResponse {
  code: string;
  qrCodeDataUrl: string;
  expiresAt: string;
  expiresInMinutes: number;
}

export function getDeviceIdentity(device: Device): string {
  return device.deviceId || device.androidDeviceId || device._id;
}

function timestamp(value: string | null | undefined): number {
  const parsed = value ? Date.parse(value) : Number.NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
}

function mostRecentlyUpdated(left: Device, right: Device): Device {
  const leftTimestamp = Math.max(timestamp(left.lastSeenAt), timestamp(left.connectedAt));
  const rightTimestamp = Math.max(timestamp(right.lastSeenAt), timestamp(right.connectedAt));
  return rightTimestamp > leftTimestamp ? right : left;
}

export function mergeDevices(devices: Device[]): Device[] {
  const merged = new Map<string, Device>();

  for (const device of devices) {
    const identity = getDeviceIdentity(device);
    const existing = merged.get(identity);
    merged.set(identity, existing ? mostRecentlyUpdated(existing, device) : device);
  }

  return Array.from(merged.values());
}

export class DeviceService {
  static async generatePairingCode(deviceName: string): Promise<PairingCodeResponse> {
    const res = await api.post("/devices/pairing-code", { deviceName });
    return res.data.data;
  }

  static async getDevices(options: { cache?: boolean } = {}): Promise<Device[]> {
    if (options.cache !== false && deviceCache && deviceCache.expiresAt > Date.now()) {
      return deviceCache.value;
    }
    if (options.cache !== false && deviceRequest) return deviceRequest;

    deviceRequest = api.get("/devices").then((res) => {
      const value = mergeDevices(res.data.data.devices || []);
      deviceCache = { expiresAt: Date.now() + 5_000, value };
      return value;
    }).finally(() => { deviceRequest = null; });
    return deviceRequest;
  }

  static async disconnect(deviceId: string): Promise<void> {
    await api.post(`/devices/${deviceId}/disconnect`);
    clearDeviceCache();
  }

  static async generateResumeCode(deviceId: string): Promise<ResumeCodeResponse> {
    const res = await api.post(`/devices/${deviceId}/resume-code`);
    return res.data.data;
  }

  static async deleteDevice(deviceId: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/devices/${deviceId}`);
    clearDeviceCache();
    return res.data;
  }
}

let deviceRequest: Promise<Device[]> | null = null;
let deviceCache: { expiresAt: number; value: Device[] } | null = null;

export function clearDeviceCache(): void {
  deviceCache = null;
}