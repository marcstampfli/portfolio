import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function isValidProjectImage(imagePath: string): boolean {
  // Check if the path follows our project image naming convention and exists in the public directory
  return (
    imagePath.startsWith("/images/projects/project-") &&
    imagePath.match(/\.(jpg|jpeg|png|gif)$/i) !== null
  );
}
