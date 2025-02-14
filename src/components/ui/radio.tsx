"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="radio"
        className={cn(
          "h-4 w-4 rounded-full border-input text-primary focus:ring-primary",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Radio.displayName = "Radio";

export { Radio };