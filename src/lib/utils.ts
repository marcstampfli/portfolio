import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidProjectImage(url: string) {
  if (!url) return false;
  return url.startsWith('/projects/') && 
    (url.endsWith('.jpg') || 
     url.endsWith('.jpeg') || 
     url.endsWith('.png') || 
     url.endsWith('.gif') || 
     url.endsWith('.webp'));
}
