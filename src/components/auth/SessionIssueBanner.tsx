"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionIssueBannerProps {
  onRetry: () => void;
  retrying?: boolean;
}

export function SessionIssueBanner({ onRetry, retrying = false }: SessionIssueBannerProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <span>Connection issue — retrying…</span>
      <Button variant="ghost" size="sm" className="gap-1.5 text-amber-800 hover:bg-amber-100" onClick={onRetry} disabled={retrying}>
        <RefreshCw className={`h-3.5 w-3.5 ${retrying ? "animate-spin" : ""}`} /> Retry
      </Button>
    </div>
  );
}