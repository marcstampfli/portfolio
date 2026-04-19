import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatProjectYear(
  yearStart: number | null | undefined,
  year: number | null | undefined
): string {
  if (!yearStart && !year) return "";
  if (!yearStart) return year ? String(year) : "";
  if (!year) return `${yearStart}–Present`;
  if (yearStart === year) return String(year);
  return `${yearStart}–${year}`;
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
