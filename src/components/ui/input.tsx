import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ className, label, error, helperText, id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl border bg-white/90 text-slate-900 text-sm shadow-sm shadow-slate-900/[0.02]",
          "placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 focus:shadow-[0_0_0_4px_rgba(65,72,232,0.08)]",
          "transition-all duration-200 hover:border-indigo-200",
          error ? "border-red-400" : "border-slate-300",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}