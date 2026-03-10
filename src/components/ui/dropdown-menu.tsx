"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
}

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ className, trigger, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div className="relative inline-block">
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
        {isOpen && (
          <div
            className={cn(
              "absolute right-0 z-50 mt-2 w-56 rounded-md bg-popover text-popover-foreground shadow-lg",
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

DropdownMenu.displayName = "DropdownMenu";

export { DropdownMenu };
