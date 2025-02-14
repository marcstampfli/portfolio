"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PopoverProps
  extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
}

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({ className, trigger, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div className="relative inline-block">
        <div onClick={() => setIsOpen(!isOpen)}>
          {trigger}
        </div>
        {isOpen && (
          <div
            className={cn(
              "absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-popover text-popover-foreground",
              "focus:outline-none",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        )}
      </div>
    );
  }
);

Popover.displayName = "Popover";

export { Popover };