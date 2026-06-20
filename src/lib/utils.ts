import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert standard YouTube watch URLs to embed URLs */
export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // youtube.com/watch?v=...
    if (
      (parsed.hostname === "www.youtube.com" ||
        parsed.hostname === "youtube.com") &&
      parsed.pathname === "/watch"
    ) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // youtu.be/...
    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.slice(1);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return url;
  } catch {
    // Not a valid URL yet — return as-is
    return url;
  }
}

/** Format seconds into MM:SS */
export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** Derive page title from URL */
export function deriveTitleFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "New Window";
  }
}
