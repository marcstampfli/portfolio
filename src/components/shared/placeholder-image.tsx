"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const ImageOff = dynamic(() =>
  import("lucide-react").then((mod) => mod.ImageOff),
);

interface PlaceholderImageProps {
  className?: string;
  animate?: boolean;
  fill?: boolean;
}

export default function PlaceholderImage({
  className,
  animate = true,
  fill,
}: PlaceholderImageProps) {
  const Component = animate ? motion.div : "div";

  return (
    <Component
      initial={animate ? { opacity: 0, scale: 0.95 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative flex flex-col gap-3 items-center justify-center",
        "bg-background/50 backdrop-blur-sm",
        fill && "w-full h-full",
        className,
      )}
    >
      <div className="bg-primary/5 rounded-lg p-4 backdrop-blur-sm">
        <ImageOff className="h-8 w-8 text-primary/40" aria-hidden="true" />
        <span className="mt-2 block text-sm text-muted-foreground geist-mono">
          No project image available
        </span>
      </div>
    </Component>
  );
}
