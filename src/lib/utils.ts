import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000,
  );

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Parse a comma/newline separated recipient list.
 * Returns valid, invalid, and duplicate numbers.
 */
export function parseRecipients(input: string) {
  const raw = input
    .split(/[,\n;]+/)
    .map((n) => n.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];
  const duplicates: string[] = [];

  for (const r of raw) {
    const cleaned = r.replace(/[^\d+]/g, "").replace(/^\+/, "");
    let national = "";

    if (cleaned.startsWith("880")) national = cleaned.slice(3);
    else if (cleaned.startsWith("0")) national = cleaned.slice(1);
    else if (cleaned.length === 10) national = cleaned;
    else {
      invalid.push(r);
      continue;
    }

    if (
      national.length !== 10 ||
      !national.startsWith("1") ||
      !["3", "4", "5", "6", "7", "8", "9"].includes(national[1])
    ) {
      invalid.push(r);
      continue;
    }

    const norm = `+880${national}`;
    if (seen.has(norm)) {
      duplicates.push(norm);
      continue;
    }
    seen.add(norm);
    valid.push(norm);
  }

  return { valid, invalid, duplicates, total: raw.length };
}

/**
 * Estimate SMS parts based on encoding.
 */
export function calculateSmsParts(message: string): number {
  const isGsm = /^[\u0000-\u007F\u00A0-\u00FF]*$/.test(message);
  const len = message.length;
  if (isGsm) return len <= 160 ? 1 : Math.ceil(len / 153);
  return len <= 70 ? 1 : Math.ceil(len / 67);
}