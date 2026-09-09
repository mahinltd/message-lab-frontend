"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordRequirement {
  label: string;
  test: (value: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "One number", test: (v) => /[0-9]/.test(v) },
];

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  showRequirements?: boolean;
  autoComplete?: string;
}

export function PasswordField({
  id,
  label,
  placeholder,
  value = "",
  onChange,
  onBlur,
  error,
  showRequirements = false,
  autoComplete = "current-password",
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const showHints = showRequirements && isFocused && value.length > 0;

  return (
    <div>
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
      >
        {label}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 pr-12",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
            "transition-all duration-200 text-sm",
            error
              ? "border-red-400 dark:border-red-500"
              : "border-gray-300 dark:border-gray-700"
          )}
        />

        {/* Eye toggle */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}

      {/* Live requirements */}
      {showHints && (
        <div className="mt-3 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {requirements.map((req) => {
            const passed = req.test(value);
            return (
              <div key={req.label} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200",
                    passed
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  {passed ? (
                    <Check className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
                  ) : (
                    <X className="w-2.5 h-2.5 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs transition-colors duration-200",
                    passed
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  {req.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}