"use client";

import React from "react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-3xl" />
    </div>
  );
}