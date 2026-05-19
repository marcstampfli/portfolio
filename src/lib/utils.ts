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

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"];

export function isValidLocalImage(url: string | undefined | null): url is string {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    (lower.startsWith("/projects/") || lower.startsWith("/experiences/")) &&
    IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext))
  );
}
