import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-indigo-100/80 bg-white/90 shadow-sm shadow-indigo-950/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-950/[0.08] dark:border-gray-800 dark:bg-gray-900",
        hover && "hover:border-indigo-200 hover:shadow-lg motion-reduce:transform-none",
        className,
      )}
      {...props}
    />
  );
}