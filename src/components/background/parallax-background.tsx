"use client";

import { useRef } from "react";
import {
  motion as _motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useIsMobile } from "@/hooks/use-is-mobile";

interface ParallaxBackgroundProps {
  children: React.ReactNode;
}

export function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll();

  const springConfig = { stiffness: 60, damping: 30, restDelta: 0.001 };

  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "30%"]), springConfig);
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]), springConfig);
  const rotate1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 30]), springConfig);
  const rotate2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -30]), springConfig);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]), springConfig);
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.2, 0.4]),
    springConfig
  );

  // Disable parallax for reduced motion preference
  if (prefersReducedMotion) {
    return (
      <div ref={ref} className="relative">
        {children}

        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.08),transparent_28%)]" />
          <div className="absolute left-[12%] top-[18%] h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-[16%] right-[10%] h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div ref={ref} className="relative">
        {children}

        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.09),transparent_32%)]" />
          <div className="absolute -right-[18vw] top-[8vh] h-[48vw] w-[48vw] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -left-[20vw] bottom-[10vh] h-[54vw] w-[54vw] rounded-full bg-primary/5 blur-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <_motion.div
          style={{ y: y1, rotate: rotate1, scale, opacity }}
          className="absolute -right-[14vw] top-[2vh] h-[46vw] w-[46vw] rounded-full bg-primary/10 blur-3xl"
        />

        <_motion.div
          style={{ y: y2, rotate: rotate2, scale, opacity }}
          className="absolute -bottom-[18vh] -left-[14vw] h-[52vw] w-[52vw] rounded-full bg-primary/10 blur-3xl"
        />

        <_motion.div
          style={{ scale, opacity }}
          className="absolute left-1/2 top-1/2 h-[72vh] w-[72vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,hsl(var(--foreground)/0.03)_0%,transparent_66%)] blur-2xl"
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--grid-color)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--grid-color)) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />
      </div>

      {children}
    </div>
  );
}
