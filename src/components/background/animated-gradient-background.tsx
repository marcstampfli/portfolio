"use client";

import React, { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

export function AnimatedGradientBackground() {
  const prefersReducedMotion = useReducedMotion();
  
  // Significantly reduce particles for better performance
  const particles = useMemo(() => {
    if (prefersReducedMotion) return [];
    
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 2, // 2-5px (smaller)
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 15,
      animationDuration: Math.random() * 8 + 12, // Shorter duration
    }));
  }, [prefersReducedMotion]);

  // Reduce connections for better performance
  const connections = useMemo(() => {
    if (prefersReducedMotion || particles.length === 0) return [];
    
    return Array.from({ length: 8 }, (_, i) => {
      const particle1 = particles[Math.floor(Math.random() * particles.length)];
      const particle2 = particles[Math.floor(Math.random() * particles.length)];
      
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
        animationDelay: Math.random() * 8,
        animationDuration: Math.random() * 4 + 6,
      };
    });
  }, [particles, prefersReducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Dark background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/3 via-transparent to-primary/5" />
      </div>
      
      {/* Floating particles - only render if motion is enabled */}
      {!prefersReducedMotion && particles.length > 0 && (
        <div className="absolute inset-0 will-change-auto">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-primary/40 animate-float-particle will-change-transform"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`,
                boxShadow: `0 0 ${particle.size * 1.5}px rgba(59, 130, 246, 0.2)`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Connection lines between particles - only render if motion is enabled */}
      {!prefersReducedMotion && connections.length > 0 && (
        <div className="absolute inset-0 will-change-auto">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="absolute h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-connection-pulse will-change-transform"
              style={{
                left: `${connection.left}%`,
                top: `${connection.top}%`,
                width: `${connection.width}%`,
                transform: `rotate(${connection.angle}deg)`,
                transformOrigin: '0 50%',
                opacity: connection.opacity,
                animationDelay: `${connection.animationDelay}s`,
                animationDuration: `${connection.animationDuration}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Simplified ambient glow for reduced motion */}
      <div className="absolute inset-0">
        {prefersReducedMotion ? (
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl opacity-50" />
        ) : (
          <>
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/2 rounded-full blur-3xl animate-pulse-slower" />
          </>
        )}
      </div>
    </div>
  );
}
