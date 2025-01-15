"use client";

import { motion } from "framer-motion";
import { MotionValue } from "framer-motion";

interface TimelineProgressProps {
  scrollYProgress: MotionValue<number>;
}

export function TimelineProgress({ scrollYProgress }: TimelineProgressProps) {
  return (
    <motion.div
      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent"
      style={{
        scaleY: scrollYProgress,
        originY: 0,
      }}
    >
      <div className="absolute inset-0 w-full animate-glow bg-primary/20" />
    </motion.div>
  );
}
