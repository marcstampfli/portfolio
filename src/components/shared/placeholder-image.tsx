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

export function PlaceholderImage({
  className,
  size = "md",
  animate = true,
}: PlaceholderImageProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-16 h-16 text-sm",
    lg: "w-24 h-24 text-base",
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl border border-primary/10",
        "bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5",
        "flex items-center justify-center font-medium text-primary/70",
        sizes[size],
        className,
      )}
      initial={animate ? { opacity: 0, scale: 0.9 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      whileHover={animate ? { scale: 1.05 } : undefined}
    >
      <Image
        src="/images/placeholder.svg"
        alt="Project placeholder"
        fill
        className="object-cover"
        priority
      />
    </motion.div>
  );
}
