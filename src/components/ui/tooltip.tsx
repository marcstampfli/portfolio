"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  content: React.ReactNode;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, content, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
      <div
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
        {isVisible && (
          <div
            className={cn(
              "absolute z-50 rounded-md bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md",
              "left-1/2 mt-2 -translate-x-1/2 transform",
              className
            )}
            ref={ref}
            {...props}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

export { Tooltip };
