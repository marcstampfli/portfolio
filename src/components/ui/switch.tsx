"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={cn(
          "relative h-6 w-11 rounded-full bg-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-background before:transition-transform",
          "checked:bg-primary checked:before:translate-x-5",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Switch.displayName = "Switch";

export { Switch };