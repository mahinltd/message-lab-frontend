"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/auth/PasswordField";
import { AccountService } from "@/lib/account";
import { getApiErrorMessage } from "@/lib/utils";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Uppercase letter required")
      .regex(/[a-z]/, "Lowercase letter required")
      .regex(/[0-9]/, "Number required"),
    confirmPassword: z.string().min(1, "Please confirm"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormInput = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormInput) => {
    setIsLoading(true);
    try {
      await AccountService.changePassword(data);
      toast.success("Password changed successfully");
      reset();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to change password"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="currentPassword"
        control={control}
        render={({ field }) => (
          <PasswordField
            id="current-pw"
            label="Current Password"
            placeholder="Enter current password"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.currentPassword?.message}
            autoComplete="current-password"
          />
        )}
      />

      <Controller
        name="newPassword"
        control={control}
        render={({ field }) => (
          <PasswordField
            id="new-pw"
            label="New Password"
            placeholder="Create a strong password"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.newPassword?.message}
            showRequirements
            autoComplete="new-password"
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <PasswordField
            id="confirm-pw"
            label="Confirm New Password"
            placeholder="Re-enter new password"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
          />
        )}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          disabled={!isDirty}
          className="gap-2"
        >
          <KeyRound className="w-4 h-4" /> Change Password
        </Button>
      </div>
    </form>
  );
}