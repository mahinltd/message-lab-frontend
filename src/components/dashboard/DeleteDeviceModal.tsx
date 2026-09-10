"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { DeviceService } from "@/lib/device";
import { Device } from "@/types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/utils";
import { toast } from "sonner";

interface DeleteDeviceModalProps {
  open: boolean;
  onClose: () => void;
  device: Device;
  onDeleted: () => void;
}

export function DeleteDeviceModal({ open, onClose, device, onDeleted }: DeleteDeviceModalProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await DeviceService.deleteDevice(device._id);
      toast.success("Device deleted");
      onDeleted();
      onClose();
    } catch (error: unknown) {
      const fallback = getApiErrorStatus(error) === 409 || getApiErrorStatus(error) === 404
        ? "This device cannot be deleted right now."
        : "Failed to delete device";
      toast.error(getApiErrorMessage(error, fallback));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Delete Device?">
      <div className="space-y-6">
        <p className="text-sm leading-relaxed text-slate-600">
          This permanently removes &apos;{device.deviceName}&apos; and its mirrored inbox messages from your account. Campaign history is kept. This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={deleting}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} isLoading={deleting} className="gap-2">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}