"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountService } from "@/lib/account";
import { useAuthStore } from "@/stores/authStore";

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
      const res = await AccountService.updateProfile({
        name: data.name,
        mobile: data.mobile || "",
      });
      updateUser(res.user);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input id="name" label="Full Name" error={errors.name?.message} {...register("name")} />
      <Input
        id="email"
        label="Email Address"
        disabled
        helperText="Email cannot be changed"
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