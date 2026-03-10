"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max(value, 0), max);

    return (
      <div
        className={cn("h-2 w-full overflow-hidden rounded-full bg-input", className)}
        ref={ref}
        {...props}
      >
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${(percentage / max) * 100}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
