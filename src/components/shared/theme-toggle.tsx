"use client";

import { useTheme } from "@/components/shared/theme-provider";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const subscribeToMount = () => () => {};
const getClientMountSnapshot = () => true;
const getServerMountSnapshot = () => false;

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToMount,
    getClientMountSnapshot,
    getServerMountSnapshot
  );

  // Keep the server render and the first client render identical. The stored
  // or system theme is resolved after hydration.
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      className={cn(
        "transition-theme relative inline-flex h-11 w-11 items-center justify-center rounded-sm border-0 bg-transparent text-muted-foreground hover:text-primary",
        className
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d={isDark ? "M12 3 A9 9 0 0 0 12 21 Z" : "M12 3 A9 9 0 0 1 12 21 Z"}
          fill="currentColor"
        />
      </svg>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
