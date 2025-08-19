"use client";

import { motion } from "framer-motion";

export interface TimelineProgressProps {
  isLoading: boolean;
}

export function TimelineProgress({ isLoading }: TimelineProgressProps) {
  return (
    <div className="absolute left-0 right-0 top-[-1px] h-[2px]">
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className={`h-full w-full ${
          isLoading 
            ? "animate-pulse bg-muted/50" 
            : "bg-gradient-to-r from-primary/50 via-primary/30 to-transparent"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
    </div>
  );
}
