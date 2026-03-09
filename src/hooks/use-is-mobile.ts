"use client";

import { useSyncExternalStore } from "react";

export function useIsMobile(breakpoint = 768): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("resize", onStoreChange);
      return () => window.removeEventListener("resize", onStoreChange);
    },
    () => window.innerWidth < breakpoint || "ontouchstart" in window,
    () => false
  );
}
