"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { DeviceService } from "@/lib/device";
import { Device } from "@/types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/utils";

const RECONNECT_HELPER = "Open the Messages Lab app on this phone and scan this QR — or enter the code — to reconnect this device. No new device will be created.";

interface ReconnectDeviceModalProps {
  open: boolean;
  onClose: () => void;
  device: Device;
  onConnected: () => void;
}

export function ReconnectDeviceModal({ open, onClose, device, onConnected }: ReconnectDeviceModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeCode, setResumeCode] = useState<Awaited<ReturnType<typeof DeviceService.generateResumeCode>> | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [success, setSuccess] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const successRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (successRef.current) clearTimeout(successRef.current);
    pollRef.current = null;
    timerRef.current = null;
    successRef.current = null;
  };

  useEffect(() => cleanup, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const start = async () => {
      setLoading(true);
      setError(null);
      setResumeCode(null);
      setSuccess(false);
      setSecondsLeft(0);
      try {
        const result = await DeviceService.generateResumeCode(device._id);
        if (cancelled) return;
        setResumeCode(result);
        setSecondsLeft(result.expiresInMinutes * 60);
        pollRef.current = setInterval(async () => {
          try {
            const devices = await DeviceService.getDevices();
            if (devices.some((item) => item._id === device._id && item.status === "active")) {
              cleanup();
              setSuccess(true);
              successRef.current = setTimeout(() => {
                onConnected();
                onClose();
              }, 1200);
            }
          } catch {
            // Keep polling while the device is reconnecting.
          }
        }, 3000);
        timerRef.current = setInterval(() => {
          setSecondsLeft((current) => {
            if (current <= 1) {
              cleanup();
              return 0;
            }
            return current - 1;
          });
        }, 1000);
      } catch (requestError: unknown) {
        if (cancelled) return;
        setError(
          getApiErrorStatus(requestError) === 409
            ? getApiErrorMessage(requestError, "This device cannot be reconnected right now.")
            : getApiErrorMessage(requestError, "Failed to generate reconnect code")
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    start();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [device._id, onClose, onConnected, open]);

  const handleClose = () => {
    cleanup();
    onClose();
  };
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <Modal open={open} onClose={handleClose} title="Reconnect Device">
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      )}
      {!loading && error && (
        <div className="space-y-5">
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          <Button variant="outline" className="w-full" onClick={handleClose}>Close</Button>
        </div>
      )}
      {!loading && !error && success && (
        <div className="space-y-4 py-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <h3 className="text-lg font-bold text-slate-900">Device reconnected</h3>
        </div>
      )}
      {!loading && !error && !success && resumeCode && (
        <div className="space-y-5 text-center">
          <div className="mx-auto inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            Expires in {mm}:{ss}
          </div>
          <div className="mx-auto h-52 w-52 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resumeCode.qrCodeDataUrl} alt="Reconnect QR code" className="h-full w-full" />
          </div>
          <div>
            <p className="mb-1 text-xs text-slate-500">Or enter this code in the app</p>
            <p className="font-mono text-3xl font-extrabold tracking-widest text-indigo-600">{resumeCode.code}</p>
          </div>
          <p className="flex items-start gap-2 text-left text-sm leading-relaxed text-slate-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
            {RECONNECT_HELPER}
          </p>
          <Button variant="outline" className="w-full" onClick={handleClose}>Cancel</Button>
        </div>
      )}
    </Modal>
  );
}