import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr?: string | Date): string {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Recent";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatNumber(num?: number): string {
  const n = num || 0;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function resolveMediaUrl(url?: string): string {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  const apiUrl = import.meta.env.VITE_API_URL;
  if (
    apiUrl &&
    (apiUrl.startsWith("http://") || apiUrl.startsWith("https://"))
  ) {
    try {
      const origin = new URL(apiUrl).origin;
      return `${origin}${url.startsWith("/") ? url : `/${url}`}`;
    } catch {
      return url;
    }
  }
  return url;
}

/**
 * Safely opens an external HTTP/HTTPS URL in a new tab with noopener,noreferrer.
 * Blocks javascript:, data:, or other unsafe schemes.
 */
export function safeOpenExternalUrl(url?: string): void {
  if (!url) return;
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
    window.open(parsed.href, "_blank", "noopener,noreferrer");
  } catch {
    // Ignore malformed URLs
  }
}
