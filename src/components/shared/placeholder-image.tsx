"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PlaceholderImageProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  text?: string;
}

export default function PlaceholderImage({
  className,
  size = "md",
  animate = true,
  text,
}: PlaceholderImageProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };

  const Component = animate ? motion.div : "div";

  return (
    <Component
      initial={animate ? { opacity: 0, scale: 0.95 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative flex items-center justify-center bg-muted",
        sizes[size],
        className,
      )}
    >
      {text ? (
        <span className="text-muted-foreground">{text}</span>
      ) : (
        <Image
          src="/images/placeholder.svg"
          alt="Placeholder"
          width={24}
          height={24}
          className="h-1/2 w-1/2 text-muted-foreground"
        />
      )}
    </Component>
  );
}
