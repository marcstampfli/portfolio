"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { getScrollBehavior } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frame: number | null = null;
    const handleScroll = () => {
      if (frame !== null) {
        return;
      }
      frame = window.requestAnimationFrame(() => {
        frame = null;
        setIsVisible(window.scrollY > 300);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: getScrollBehavior() });

  return isVisible ? (
    <button
      type="button"
      onClick={scrollToTop}
      className="group fixed bottom-8 right-8 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  ) : null;
}
