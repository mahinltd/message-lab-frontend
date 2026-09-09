import { api } from "@/lib/api";
import { Device, PairingCodeResponse } from "@/types";

export class DeviceService {
  static async generatePairingCode(deviceName: string): Promise<PairingCodeResponse> {
    const res = await api.post("/devices/pairing-code", { deviceName });
    return res.data.data;
  }

  static async getDevices(): Promise<Device[]> {
    const res = await api.get("/devices");
    return res.data.data.devices;
  }

  static async disconnect(deviceId: string): Promise<void> {
    await api.delete(`/devices/${deviceId}`);
  }
}