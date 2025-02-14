"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative w-full rounded-lg border p-4",
          variant === "default" && "bg-background text-foreground",
          variant === "destructive" && "bg-destructive text-destructive-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Alert.displayName = "Alert";

export { Alert };