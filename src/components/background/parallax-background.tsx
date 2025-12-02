"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion as _motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

interface ParallaxBackgroundProps {
  children: React.ReactNode;
}

// Hook to detect mobile devices
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const springConfig = { stiffness: 60, damping: 30, restDelta: 0.001 };

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "30%"]),
    springConfig,
  );
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]),
    springConfig,
  );
  const rotate1 = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 30]),
    springConfig,
  );
  const rotate2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -30]),
    springConfig,
  );
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]),
    springConfig,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.2, 0.4]),
    springConfig,
  );

  // Disable parallax for reduced motion preference
  if (prefersReducedMotion) {
    return (
      <div ref={ref} className="relative">
        {children}
        
        {/* Static background for reduced motion */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-30" />
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-primary/3 rounded-full blur-2xl" />
        </div>
      </div>
    );
  }

  // Simplified background for mobile (better performance)
  if (isMobile) {
    return (
      <div ref={ref} className="relative">
        {children}
        
        {/* Static background for mobile - no animations */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='rgba(168,85,247,0.05)' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top right blob */}
        <_motion.div
          style={{ y: y1, rotate: rotate1, scale, opacity }}
          className="absolute -top-1/4 -right-1/4 w-[50vw] h-[50vw] rounded-full bg-[rgba(168,85,247,0.2)] blur-3xl"
        />

        {/* Bottom left blob */}
        <_motion.div
          style={{ y: y2, rotate: rotate2, scale, opacity }}
          className="absolute -bottom-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-[rgba(124,58,237,0.2)] blur-3xl"
        />

        {/* Center gradient */}
        <_motion.div
          style={{ scale, opacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[radial-gradient(circle,rgba(168,85,247,0.05)_0%,transparent_100%)] blur-2xl"
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='rgba(168,85,247,0.05)' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {children}
    </div>
  );
}
