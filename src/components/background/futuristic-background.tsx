"use client";

import { useEffect, useRef, useState } from "react";

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  pulseSpeed: number;
}

interface BackgroundEnvironment {
  ready: boolean;
  prefersReducedMotion: boolean;
  isMobile: boolean;
}

function seededRandom(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function createPoints(width: number, height: number, count: number): NodePoint[] {
  return Array.from({ length: count }, (_, index) => ({
    x: seededRandom(index * 101.7) * width,
    y: seededRandom(index * 211.3) * height,
    vx: (seededRandom(index * 307.9) - 0.5) * 9,
    vy: (seededRandom(index * 401.1) - 0.5) * 9,
    radius: 1.2 + seededRandom(index * 503.4) * 1.8,
    phase: seededRandom(index * 601.9) * Math.PI * 2,
    pulseSpeed: 0.45 + seededRandom(index * 701.2) * 0.4,
  }));
}

export function FuturisticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<NodePoint[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const [environment, setEnvironment] = useState<BackgroundEnvironment>({
    ready: false,
    prefersReducedMotion: false,
    isMobile: false,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateEnvironment = () =>
      setEnvironment({
        ready: true,
        prefersReducedMotion: mediaQuery.matches,
        isMobile: window.innerWidth < 768 || "ontouchstart" in window,
      });

    updateEnvironment();
    mediaQuery.addEventListener("change", updateEnvironment);
    window.addEventListener("resize", updateEnvironment, { passive: true });
    return () => {
      mediaQuery.removeEventListener("change", updateEnvironment);
      window.removeEventListener("resize", updateEnvironment);
    };
  }, []);

  const shouldAnimateCanvas =
    environment.ready && !environment.prefersReducedMotion && !environment.isMobile;

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
    const renderingContext = context;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;
    let isDocumentVisible = document.visibilityState === "visible";
    const targetFrameTime = 1000 / 24;
    const connectionDistance = 180;
    const connectionDistanceSquared = connectionDistance ** 2;

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

    const stopAnimation = () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    function scheduleFrame() {
      if (animationFrameRef.current === null && isVisible && isDocumentVisible) {
        animationFrameRef.current = window.requestAnimationFrame(draw);
      }
    }

    function draw(timestamp: number) {
      animationFrameRef.current = null;

      if (!isVisible || !isDocumentVisible) {
        return;
      }

      if (
        lastFrameTimeRef.current !== 0 &&
        timestamp - lastFrameTimeRef.current < targetFrameTime
      ) {
        scheduleFrame();
        return;
      }

      const elapsedSeconds =
        lastFrameTimeRef.current === 0
          ? 0
          : Math.min((timestamp - lastFrameTimeRef.current) / 1000, 0.1);
      lastFrameTimeRef.current = timestamp;

      renderingContext.setTransform(1, 0, 0, 1, 0, 0);
      renderingContext.clearRect(0, 0, canvas.width, canvas.height);
      renderingContext.setTransform(dpr, 0, 0, dpr, 0, 0);

      const points = pointsRef.current;

      for (const point of points) {
        point.x += point.vx * elapsedSeconds;
        point.y += point.vy * elapsedSeconds;

        if (point.x < -20) point.x = width + 20;
        if (point.x > width + 20) point.x = -20;
        if (point.y < -20) point.y = height + 20;
        if (point.y > height + 20) point.y = -20;
      }

      renderingContext.lineWidth = 0.7;

      for (let i = 0; i < points.length; i += 1) {
        const pointA = points[i];

        for (let j = i + 1; j < points.length; j += 1) {
          const pointB = points[j];
          const dx = pointB.x - pointA.x;
          const dy = pointB.y - pointA.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared > connectionDistanceSquared) {
            continue;
          }

          const opacity = (1 - Math.sqrt(distanceSquared) / connectionDistance) * 0.17;
          renderingContext.strokeStyle = `hsla(192, 92%, 60%, ${opacity})`;
          renderingContext.beginPath();
          renderingContext.moveTo(pointA.x, pointA.y);
          renderingContext.lineTo(pointB.x, pointB.y);
          renderingContext.stroke();
        }
      }

      for (const point of points) {
        const pulse = 0.84 + Math.sin((timestamp / 1000) * point.pulseSpeed + point.phase) * 0.16;
        const radius = point.radius * (0.92 + pulse * 0.08);

        renderingContext.fillStyle = `hsla(192, 92%, 60%, ${0.42 + pulse * 0.16})`;
        renderingContext.beginPath();
        renderingContext.arc(point.x, point.y, radius, 0, Math.PI * 2);
        renderingContext.fill();
      }

      scheduleFrame();
    }

    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;

      if (isVisible) {
        lastFrameTimeRef.current = 0;
        scheduleFrame();
      } else {
        stopAnimation();
      }
    });
    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState === "visible";

      if (isDocumentVisible) {
        lastFrameTimeRef.current = 0;
        scheduleFrame();
      } else {
        stopAnimation();
      }
    };

    resizeObserver.observe(wrapper);
    intersectionObserver.observe(wrapper);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    scheduleFrame();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAnimation();
      lastFrameTimeRef.current = 0;
    };
  }, [shouldAnimateCanvas]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--grid-color)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--grid-color)) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage: "linear-gradient(to bottom, black 0%, black 58%, transparent 100%)",
        }}
      />

      {shouldAnimateCanvas ? (
        <canvas ref={canvasRef} className="absolute inset-0 opacity-80" aria-hidden="true" />
      ) : null}
    </div>
  );
}
