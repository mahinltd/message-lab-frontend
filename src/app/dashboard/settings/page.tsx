"use client";

import React from "react";
import { User, Lock } from "lucide-react";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { useAuthStore } from "@/stores/authStore";

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account preferences and security.
        </p>
      </div>

      {/* Profile */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Profile Information</h3>
            <p className="text-sm text-slate-500">Update your personal details</p>
          </div>
        </div>
        <ProfileForm />
      </div>

      {/* Password */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Lock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Change Password</h3>
            <p className="text-sm text-slate-500">
              Keep your account secure with a strong password
            </p>
          </div>
        </div>

        {user?.authProviders?.google && !user?.authProviders?.local ? (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
            This account uses Google sign-in and does not currently have a local password.
            Password changes are unavailable for this account.
          </div>
        ) : (
          <ChangePasswordForm />
        )}
      </div>
    </div>
  );
}