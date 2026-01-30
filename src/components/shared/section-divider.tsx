"use client";

import { cn } from "@/lib/utils";

type DividerVariant = "gradient" | "dots" | "wave" | "fade";

interface SectionDividerProps {
  variant?: DividerVariant;
  className?: string;
  flip?: boolean;
}

export function SectionDivider({ 
  variant = "gradient", 
  className,
  flip = false 
}: SectionDividerProps) {
  const baseClasses = cn(
    "w-full overflow-hidden",
    flip && "rotate-180",
    className
  );

  switch (variant) {
    case "gradient":
      return (
        <div className={cn(baseClasses, "h-24 relative")} aria-hidden="true">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-2 w-2 rounded-full bg-primary/40 ring-4 ring-primary/10" />
          </div>
        </div>
      );

    case "dots":
      return (
        <div className={cn(baseClasses, "h-16 flex items-center justify-center gap-2")} aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`dot-${i + 1}`}
              className="h-1.5 w-1.5 rounded-full bg-primary/30"
              style={{ opacity: 1 - i * 0.2 }}
            />
          ))}
        </div>
      );

    case "wave":
      return (
        <div className={cn(baseClasses, "h-16")} aria-hidden="true">
          <svg
            viewBox="0 0 1200 60"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-primary/20"
            />
          </svg>
        </div>
      );

    case "fade":
      return (
        <div className={cn(baseClasses, "h-32 relative")} aria-hidden="true">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
        </div>
      );

    default:
      return null;
  }
}

// Decorative glow effect that can be added to sections
interface DecorativeGlowProps {
  position?: "top" | "center" | "bottom";
  color?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function DecorativeGlow({
  position = "top",
  color = "primary",
  size = "md",
  className,
}: DecorativeGlowProps) {
  const positionClasses = {
    top: "-top-16 left-1/2 -translate-x-1/2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "-bottom-16 left-1/2 -translate-x-1/2",
  };

  const sizeClasses = {
    sm: "h-24 w-[200px]",
    md: "h-40 w-[380px]",
    lg: "h-56 w-[500px]",
  };

  const colorClasses = {
    primary: "bg-primary/20",
    secondary: "bg-secondary/20",
    accent: "bg-accent/20",
  };

  return (
    <div
      className={cn(
        "absolute blur-[120px] pointer-events-none",
        positionClasses[position],
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      aria-hidden="true"
    />
  );
}
