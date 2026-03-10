"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      suppressHydrationWarning
      className={cn(
        "transition-theme relative inline-flex h-11 w-11 items-center justify-center rounded-sm border-0 bg-transparent text-muted-foreground hover:text-primary",
        className
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "h-5 w-5 text-primary transition-transform duration-500",
          isDark ? "rotate-0" : "rotate-180"
        )}
        aria-hidden="true"
        suppressHydrationWarning
      >
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 3 A9 9 0 0 0 12 21 Z" fill="currentColor" />
      </svg>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
