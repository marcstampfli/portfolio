"use client";

import { useCallback, useRef } from "react";

type AnyFunction = (...args: unknown[]) => unknown;

export function useThrottle<T extends AnyFunction>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const lastRan = useRef<number>(Date.now());
  const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (lastRan.current + delay < now) {
        fn(...args);
        lastRan.current = now;
      } else {
        // Clear any existing timeout
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }

        // Schedule the function to run after the delay
        timeoutId.current = setTimeout(() => {
          fn(...args);
          lastRan.current = Date.now();
        }, delay);
      }
    },
    [fn, delay],
  );
}
