import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidProjectImage(url: string): boolean {
  if (!url) return false;
  const normalizedUrl = url.toLowerCase();

  return (
    normalizedUrl.startsWith("/projects/") &&
    (normalizedUrl.endsWith(".jpg") ||
      normalizedUrl.endsWith(".jpeg") ||
      normalizedUrl.endsWith(".png") ||
      normalizedUrl.endsWith(".gif") ||
      normalizedUrl.endsWith(".webp"))
  );
}
