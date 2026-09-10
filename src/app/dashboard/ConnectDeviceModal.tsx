"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeviceService } from "@/lib/device";
import { PairingCodeResponse } from "@/types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/utils";

interface ConnectDeviceModalProps {
  open: boolean;
  onClose: () => void;
  onConnected: () => void;
}

type Step = "name" | "code" | "success";

export function ConnectDeviceModal({ open, onClose, onConnected }: ConnectDeviceModalProps) {
  const [step, setStep] = useState<Step>("name");
  const [deviceName, setDeviceName] = useState("");
  const [pairing, setPairing] = useState<PairingCodeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const generatedAtRef = useRef<number>(0);

  const cleanup = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    pollRef.current = null;
    timerRef.current = null;
  };

  useEffect(() => cleanup, []);

  const handleClose = () => {
    cleanup();
    setStep("name");
    setDeviceName("");
    setPairing(null);
    onClose();
  };

  const startPolling = () => {
    generatedAtRef.current = Date.now();
    pollRef.current = setInterval(async () => {
      try {
        const devices = await DeviceService.getDevices();
        const newDevice = devices.find(
          (d) => new Date(d.connectedAt).getTime() > generatedAtRef.current - 2000
        );
        if (newDevice) {
          cleanup();
          setStep("success");
          toast.success("Device connected successfully!");
          setTimeout(() => {
            onConnected();
            handleClose();
          }, 1200);
        }
      } catch {
        // ignore
      }
    }, 3000);
  };

  const handleGenerate = async () => {
    if (!deviceName.trim()) {
      toast.error("Please enter a device name");
      return;
    }
    setLoading(true);
    try {
      const result = await DeviceService.generatePairingCode(deviceName.trim());
      setPairing(result);
      setSecondsLeft(result.expiresInMinutes * 60);
      setStep("code");
      startPolling();

      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            cleanup();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to generate pairing code"));
    } finally {
      setLoading(false);
    }
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm" onClick={handleClose} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="pointer-events-auto w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h2 className="text-base font-bold text-slate-900">Connect Device</h2>
                <button onClick={handleClose} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Step: Name */}
                {step === "name" && (
                  <div className="space-y-5">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Give your Android device a name. You&apos;ll get a QR code and a 6-digit
                      code to enter in the Messages Lab app.
                    </p>
                    <Input
                      id="device-name"
                      label="Device Name"
                      placeholder="My Samsung Phone"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                    />
                    <Button className="w-full" size="lg" onClick={handleGenerate} isLoading={loading}>
                      Generate Pairing Code
                    </Button>
                  </div>
                )}

                {/* Step: Code */}
                {step === "code" && pairing && (
                  <div className="text-center space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                      Expires in {mm}:{ss}
                    </div>

                    {/* QR */}
                    <div className="mx-auto w-52 h-52 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pairing.qrCodeDataUrl} alt="Pairing QR code" className="w-full h-full" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Or enter this code in the app</p>
                      <p className="text-3xl font-extrabold tracking-[0.3em] text-indigo-600">
                        {pairing.code}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                      Waiting for device to connect...
                    </div>
                  </div>
                )}

                {/* Step: Success */}
                {step === "success" && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Device Connected!</h3>
                    <p className="text-sm text-slate-600">Your device is now ready to send SMS.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}