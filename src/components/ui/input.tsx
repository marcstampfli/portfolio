"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "transition-theme flex h-12 w-full rounded-md border border-border/80 bg-background/50 px-4 py-3 text-sm text-foreground shadow-[inset_0_1px_0_hsl(var(--foreground)/0.03)] placeholder:text-muted-foreground/80 hover:border-borderStrong focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
