import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full text-xs font-semibold",
        variant === "info"
          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
        className,
      )}
      {...props}
    />
  );
}