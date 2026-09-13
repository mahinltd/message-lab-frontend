"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ImagePlus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountService } from "@/lib/account";
import { useAuthStore } from "@/stores/authStore";
import { getApiErrorMessage } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email(),
  mobile: z
    .string()
    .refine((v) => /^(\+?8801|01)[0-9]{9}$/.test(v.replace(/[\s-]/g, "")), {
      message: "Invalid Bangladeshi mobile number",
    })
    .or(z.literal("")),
});

type FormInput = z.infer<typeof schema>;

export function ProfileForm() {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
    },
  });

  const onSubmit = async (data: FormInput) => {
    setIsLoading(true);
    try {
      if (data.email.toLowerCase() !== user?.email?.toLowerCase()) {
        await AccountService.requestEmailChange(data.email);
        toast.success("Check your new email address to confirm the change");
      }
      const res = await AccountService.updateProfile({
        name: data.name,
        mobile: data.mobile || "",
      });
      updateUser(res.user);
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Update failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const onImageSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Use a JPG, PNG, or WebP image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile images must be 5 MB or smaller");
      return;
    }
    setIsUploading(true);
    try {
      const result = await AccountService.uploadProfilePicture(file);
      updateUser({ profilePicture: result.profilePicture });
      toast.success("Profile picture updated");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Profile picture upload failed"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input id="name" label="Full Name" error={errors.name?.message} {...register("name")} />
      <div className="flex items-center gap-4">
        {user?.profilePicture ? (
          <Image src={user.profilePicture} alt="Current profile" width={64} height={64} unoptimized className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
            {user?.name ? user.name.slice(0, 1).toUpperCase() : "?"}
          </div>
        )}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <ImagePlus className="h-4 w-4" /> {isUploading ? "Uploading..." : "Upload picture"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onImageSelected} disabled={isUploading} />
        </label>
      </div>
      <Input
        id="email"
        label="Email Address"
        helperText="A confirmation link will be sent when you change this address"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input id="mobile" label="Mobile Number" error={errors.mobile?.message} {...register("mobile")} />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          disabled={!isDirty}
          className="gap-2"
        >
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>
    </form>
  );
}