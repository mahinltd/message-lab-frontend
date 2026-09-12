import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transform-none";

  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:via-indigo-700 hover:to-purple-700 focus:ring-indigo-500 shadow-md shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/25",
    secondary: "bg-white/80 text-gray-900 ring-1 ring-inset ring-indigo-100 hover:bg-indigo-50 hover:text-indigo-700 focus:ring-indigo-400 dark:bg-gray-800 dark:text-gray-100",
    outline: "border border-indigo-200 bg-white/50 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-800 focus:ring-indigo-500",
    ghost: "text-gray-600 dark:text-gray-400 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-gray-800 dark:hover:text-indigo-300",
    danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus:ring-red-500 shadow-sm hover:shadow-md",
  };

  const sizes = {
    sm: "px-3.5 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-[15px]",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}