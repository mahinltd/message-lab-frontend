"use client";

import React, { useEffect, useState } from "react";
import {
  Smartphone, Plus, Battery, Wifi, Loader2, Unplug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConnectDeviceModal } from "@/app/dashboard/ConnectDeviceModal";
import { DeviceService } from "@/lib/device";
import { Device } from "@/types";
import { timeAgo } from "@/lib/utils";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/utils";

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await DeviceService.getDevices();
      setDevices(data || []);
    } catch {
      toast.error("Failed to load devices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    DeviceService.getDevices()
      .then((data) => {
        if (!cancelled) setDevices(data || []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load devices");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleDisconnect = async (id: string) => {
    if (!confirm("Disconnect this device? It will no longer be able to send SMS.")) return;
    setDisconnecting(id);
    try {
      await DeviceService.disconnect(id);
      toast.success("Device disconnected");
      load();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to disconnect"));
    } finally {
      setDisconnecting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Your Devices</h2>
          <p className="text-sm text-slate-500 mt-1">Manage the Android devices connected to your account.</p>
        </div>
        <Button size="md" className="gap-2" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" /> Connect Device
        </Button>
      </div>

      {/* Empty state */}
      {devices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <Smartphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900">No devices connected</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Connect your Android phone to start sending SMS through your own SIM card.
          </p>
          <Button className="mt-5 gap-2" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Connect Your First Device
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {devices.map((device) => (
            <div
              key={device._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-indigo-600" />
                </div>
                <StatusBadge status={device.status} />
              </div>

              <h3 className="text-base font-bold text-slate-900 truncate">{device.deviceName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {device.deviceModel || "Android device"} · {device.androidVersion || "?"}
              </p>

              {/* Meta */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Battery className="w-3.5 h-3.5 text-slate-400" />
                  {device.lastHeartbeat?.batteryLevel != null
                    ? `${device.lastHeartbeat.batteryLevel}%`
                    : "—"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-slate-400" />
                  {device.lastHeartbeat?.networkType || "—"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  {device.lastHeartbeat?.hasSim ? "SIM OK" : "No SIM"}
                </div>
                <div className="text-slate-500">{device.lastSeenAt ? timeAgo(device.lastSeenAt) : "—"}</div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleDisconnect(device._id)}
                  disabled={disconnecting === device._id}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  <Unplug className="w-4 h-4" />
                  {disconnecting === device._id ? "Disconnecting..." : "Disconnect"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConnectDeviceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConnected={load}
      />
    </div>
  );
}