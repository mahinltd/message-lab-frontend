import React from "react";

interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = "or continue with" }: AuthDividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-4 bg-white dark:bg-gray-900 text-sm text-gray-400 dark:text-gray-500">
          {text}
        </span>
      </div>
    </div>
  );
}