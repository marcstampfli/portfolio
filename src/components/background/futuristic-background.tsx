"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-is-mobile";

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

function seededRandom(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function createPoints(width: number, height: number, count: number): NodePoint[] {
  return Array.from({ length: count }, (_, index) => ({
    x: seededRandom(index * 101.7) * width,
    y: seededRandom(index * 211.3) * height,
    vx: (seededRandom(index * 307.9) - 0.5) * 0.18,
    vy: (seededRandom(index * 401.1) - 0.5) * 0.18,
    radius: 1.2 + seededRandom(index * 503.4) * 1.8,
  }));
}

export function FuturisticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<NodePoint[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const shouldAnimateCanvas = !prefersReducedMotion && !isMobile;

  useEffect(() => {
    if (!shouldAnimateCanvas || !canvasRef.current || !wrapperRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return;
    }

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const pointCount = Math.min(28, Math.max(14, Math.round((width * height) / 52000)));
      pointsRef.current = createPoints(width, height, pointCount);
    };

    const draw = (timestamp: number) => {
      const targetFrameTime = 1000 / 24;

      if (timestamp - lastFrameTimeRef.current < targetFrameTime) {
        animationFrameRef.current = window.requestAnimationFrame(draw);
        return;
      }

      lastFrameTimeRef.current = timestamp;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const points = pointsRef.current;

      for (const point of points) {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < -20) point.x = width + 20;
        if (point.x > width + 20) point.x = -20;
        if (point.y < -20) point.y = height + 20;
        if (point.y > height + 20) point.y = -20;
      }

      context.lineWidth = 0.7;

      for (let i = 0; i < points.length; i += 1) {
        const pointA = points[i];

        for (let j = i + 1; j < points.length; j += 1) {
          const pointB = points[j];
          const dx = pointB.x - pointA.x;
          const dy = pointB.y - pointA.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 170) {
            continue;
          }

          const opacity = (1 - distance / 170) * 0.14;
          context.strokeStyle = `hsla(192, 92%, 60%, ${opacity})`;
          context.beginPath();
          context.moveTo(pointA.x, pointA.y);
          context.lineTo(pointB.x, pointB.y);
          context.stroke();
        }
      }

      for (const point of points) {
        context.fillStyle = "hsla(192, 92%, 60%, 0.55)";
        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        context.fill();
      }

      animationFrameRef.current = window.requestAnimationFrame(draw);
    };

    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    resizeObserver.observe(wrapper);
    animationFrameRef.current = window.requestAnimationFrame(draw);

    return () => {
      resizeObserver.disconnect();

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shouldAnimateCanvas]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.09),transparent_28%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,hsl(var(--foreground)/0.04),transparent_24%)]" />

      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--grid-color)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--grid-color)) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage: "linear-gradient(to bottom, black 0%, black 58%, transparent 100%)",
        }}
      />

      <div className="absolute left-[7%] top-[16%] h-px w-[30%] bg-gradient-to-r from-primary/30 to-transparent" />
      <div className="absolute right-[9%] top-[24%] h-px w-[18%] bg-gradient-to-l from-primary/20 to-transparent" />
      <div className="absolute bottom-[18%] right-[12%] h-[24vw] w-[24vw] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute left-[10%] top-[20%] h-[18vw] w-[18vw] rounded-full bg-primary/5 blur-3xl" />

      {shouldAnimateCanvas ? (
        <canvas ref={canvasRef} className="absolute inset-0 opacity-80" aria-hidden="true" />
      ) : null}
    </div>
  );
}
