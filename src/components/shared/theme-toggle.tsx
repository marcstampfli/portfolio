"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the current theme
  const currentTheme = theme === 'system' ? systemTheme : theme;

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      className="fixed right-14 top-3 md:top-4 md:right-16 z-50 h-10 w-10 flex items-center justify-center rounded-full bg-background/40 border border-primary/10 backdrop-blur-md transition-colors hover:bg-accent dark:hover:bg-accent/10"
      onClick={() => {
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
      }}
      aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 text-primary dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 text-primary dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}