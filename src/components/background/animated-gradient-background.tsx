"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsClient } from "@/hooks/use-is-client";

export function AnimatedGradientBackground() {
  const prefersReducedMotion = useReducedMotion();
  const isClient = useIsClient();

  const particles = useMemo(() => {
    if (prefersReducedMotion || !isClient) return [];

    // Use deterministic seed-based values to avoid hydration issues
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      size: seededRandom(i * 123) * 2 + 2,
      left: seededRandom(i * 456) * 100,
      top: seededRandom(i * 789) * 100,
      animationDelay: seededRandom(i * 321) * 15,
      animationDuration: seededRandom(i * 654) * 8 + 14,
    }));
  }, [isClient, prefersReducedMotion]);

  const connections = useMemo(() => {
    if (prefersReducedMotion || particles.length === 0 || !isClient) return [];

    // Use deterministic seed-based values to avoid hydration issues
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 5 }, (_, i) => {
      const particle1Index = Math.floor(seededRandom(i * 111) * particles.length);
      const particle2Index = Math.floor(seededRandom(i * 222) * particles.length);
      const particle1 = particles[particle1Index];
      const particle2 = particles[particle2Index];

      const dx = particle2.left - particle1.left;
      const dy = particle2.top - particle1.top;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      return {
        id: i,
        left: particle1.left,
        top: particle1.top,
        width: distance,
        angle,
        opacity: Math.max(0.1, 0.6 - distance / 60),
        animationDelay: seededRandom(i * 333) * 8,
        animationDuration: seededRandom(i * 444) * 4 + 6,
      };
    });
  }, [isClient, particles, prefersReducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.12),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,hsl(var(--foreground)/0.02)_50%,transparent_100%)]" />
      </div>

      {!prefersReducedMotion && particles.length > 0 && (
        <div className="absolute inset-0 will-change-auto">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="animate-float-particle absolute rounded-full bg-primary/50 will-change-transform"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`,
                boxShadow: `0 0 ${particle.size * 8}px hsl(var(--primary) / 0.18)`,
              }}
            />
          ))}
        </div>
      )}

      {!prefersReducedMotion && connections.length > 0 && (
        <div className="absolute inset-0 will-change-auto">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="animate-connection-pulse absolute h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent will-change-transform"
              style={{
                left: `${connection.left}%`,
                top: `${connection.top}%`,
                width: `${connection.width}%`,
                transform: `rotate(${connection.angle}deg)`,
                transformOrigin: "0 50%",
                opacity: connection.opacity,
                animationDelay: `${connection.animationDelay}s`,
                animationDuration: `${connection.animationDuration}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0">
        {prefersReducedMotion ? (
          <div className="absolute left-[18%] top-[16%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        ) : (
          <>
            <div className="animate-pulse-slow absolute left-[16%] top-[12%] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="animate-pulse-slower absolute bottom-[12%] right-[14%] h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          </>
        )}
      </div>
    </div>
  );
}
