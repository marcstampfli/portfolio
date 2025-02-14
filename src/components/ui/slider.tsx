"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="range"
        className={cn(
          "w-full h-2 bg-input rounded-full appearance-none cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Slider.displayName = "Slider";

export { Slider };