"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// Background gradient colors with more vibrant combinations
const gradients = [
  ["#22D3EE", "#818CF8", "#C084FC"], // Cyan to Indigo to Purple
  ["#FB7185", "#E879F9", "#60A5FA"], // Rose to Fuchsia to Blue
  ["#34D399", "#818CF8", "#F472B6"], // Emerald to Indigo to Pink
  ["#FCD34D", "#F87171", "#818CF8"], // Amber to Red to Indigo
  ["#A78BFA", "#EC4899", "#22D3EE"], // Purple to Pink to Cyan
] as const;

export function BackgroundGradient() {
  const [currentGradient, setCurrentGradient] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradients.length);
    }, 7000); // Change every 7 seconds

    return () => clearInterval(timer);
  }, []);

  const index = currentGradient % gradients.length;
  const gradient = gradients[index];

  return (
    <div className="fixed inset-0 -z-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentGradient}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 0.15,
            scale: 1,
            background:
              gradient &&
              [
                `radial-gradient(circle at 0% 0%, ${gradient[0]}, transparent 50%)`,
                `radial-gradient(circle at 100% 0%, ${gradient[1]}, transparent 50%)`,
                `radial-gradient(circle at 50% 100%, ${gradient[2]}, transparent 50%)`,
              ].join(", "),
          }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{
            duration: 3,
            background: {
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            },
          }}
          className="absolute inset-0 blur-3xl"
          style={{
            backgroundBlendMode: "overlay",
          }}
        />
      </AnimatePresence>
      {/* Grid pattern overlay */}
      <div className="grid-pattern opacity-20" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
    </div>
  );
}
