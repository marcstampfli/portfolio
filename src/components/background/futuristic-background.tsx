"use client";

import React, { useEffect, useRef, useState } from "react";

interface GridPoint {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  opacity: number;
  hue: number;
  connections: number;
}

export function FuturisticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<GridPoint[]>([]);
  const particleImageRef = useRef<HTMLImageElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isReady, setIsReady] = useState(false);
  const animationFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // Preload assets and initialize
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        // Preload particle image
        const image = new Image();
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
          image.src = "/images/particle.svg";
        });
        particleImageRef.current = image;

        // Initialize canvas and points
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const { width, height } = canvas.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          setDimensions({ width: canvas.width, height: canvas.height });
        }

        setIsReady(true);
      } catch (error) {
        console.error("Failed to preload assets:", error);
      }
    };

    preloadAssets();
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const { width, height } = canvas.getBoundingClientRect();

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      setDimensions({ width: canvas.width, height: canvas.height });

      // Adjust point positions based on new dimensions
      pointsRef.current = pointsRef.current.map((point) => {
        // Keep points within relative bounds of new dimensions
        const currentBound = Math.max(width, height);
        const relativeX =
          point.x / (point.x < 0 ? -currentBound : currentBound);
        const relativeY =
          point.y / (point.y < 0 ? -currentBound : currentBound);
        return {
          ...point,
          x: relativeX * width,
          y: relativeY * height,
        };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize grid points
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    setDimensions({ width: canvas.width, height: canvas.height });

    // Create 3D grid of points
    const points: GridPoint[] = [];
    const numPoints = Math.min(200, Math.max(50, (width * height) / 8000)); // Reduced number of points for better performance

    for (let i = 0; i < numPoints; i++) {
      const x = (Math.random() - 0.5) * width * 2;
      const y = (Math.random() - 0.5) * height * 2;
      const z =
        Math.random() * Math.min(width, height) - Math.min(width, height) / 2;

      points.push({
        x,
        y,
        z,
        vx: (Math.random() - 0.5) * 0.3, // Reduced velocity for performance
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
        size: 3.0 + Math.random() * 2.0, // Larger particles for visibility
        opacity: 0.4 + Math.random() * 0.4, // Increased opacity for visibility
        hue: Math.random() * 40 - 20,
        connections: 0,
      });
    }

    pointsRef.current = points;
  }, []);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || !pointsRef.current.length || !isReady) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx || !particleImageRef.current) return;

    const project3DTo2D = (x: number, y: number, z: number) => {
      const fov = Math.max(dimensions.width, dimensions.height); // Dynamic FOV based on viewport
      const scale = fov / (fov + z);
      return {
        x: dimensions.width / 2 + x * scale,
        y: dimensions.height / 2 + y * scale,
        scale,
      };
    };

    const drawConnection = (point1: GridPoint, point2: GridPoint) => {
      const proj1 = project3DTo2D(point1.x, point1.y, point1.z);
      const proj2 = project3DTo2D(point2.x, point2.y, point2.z);

      const dx = proj2.x - proj1.x;
      const dy = proj2.y - proj1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxConnectionsPerPoint = 2; // Reduced connections per point

      if (
        distance < 200 && // Reduced connection distance for performance
        point1.connections < maxConnectionsPerPoint &&
        point2.connections < maxConnectionsPerPoint
      ) {
        const avgScale = (proj1.scale + proj2.scale) / 2;
        const opacity = (1 - distance / 200) * 0.3 * avgScale; // Increased opacity for visibility

        // Increment connection count for both points
        point1.connections++;
        point2.connections++;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`; // Blue color for better visibility
        ctx.lineWidth = avgScale * 1.0; // Increased line width
        ctx.moveTo(proj1.x, proj1.y);
        ctx.lineTo(proj2.x, proj2.y);
        ctx.stroke();
      }
    };

    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return;
      
      // Throttle to ~30 FPS for better performance
      const targetFPS = 30;
      const frameInterval = 1000 / targetFPS;
      
      if (timestamp - lastFrameTimeRef.current < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastFrameTimeRef.current = timestamp;
      timeRef.current = timestamp * 0.001;
      
      // Clear with a subtle dark background for visibility
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Add a very subtle gradient background to make sure canvas is visible
      const gradient = ctx.createRadialGradient(
        dimensions.width / 2, dimensions.height / 2, 0,
        dimensions.width / 2, dimensions.height / 2, Math.max(dimensions.width, dimensions.height) / 2
      );
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.03)'); // Very subtle blue center
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.01)'); // Almost transparent edges
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      ctx.setTransform(
        window.devicePixelRatio || 1,
        0,
        0,
        window.devicePixelRatio || 1,
        0,
        0,
      );

      // Reset connection counts for each point
      pointsRef.current.forEach((point) => (point.connections = 0));

      // Update and draw points
      pointsRef.current = pointsRef.current.map((point) => {
        // Update position with momentum
        point.x += point.vx;
        point.y += point.vy;
        point.z += point.vz;

        // Boundary checks with wrapping - use relative boundaries
        const boundX = dimensions.width;
        const boundY = dimensions.height;
        const boundZ = Math.min(boundX, boundY);

        if (Math.abs(point.x) > boundX) point.x = -point.x;
        if (Math.abs(point.y) > boundY) point.y = -point.y;
        if (Math.abs(point.z) > boundZ) point.z = -point.z;

        // Mouse interaction with scaled distance
        if (mousePos) {
          const projected = project3DTo2D(point.x, point.y, point.z);
          const dx = mousePos.x - projected.x;
          const dy = mousePos.y - projected.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const interactionRadius = Math.min(400, dimensions.width * 0.3); // Responsive interaction radius

          if (distance < interactionRadius) {
            const force = (1 - distance / interactionRadius) * 0.03;
            point.vx -= dx * force;
            point.vy -= dy * force;
            point.vz += force * Math.min(25, dimensions.height * 0.02);
          }
        }

        // Speed damping
        point.vx *= 0.99;
        point.vy *= 0.99;
        point.vz *= 0.99;

        // Add subtle flow
        point.vx += (Math.random() - 0.5) * 0.05;
        point.vy += (Math.random() - 0.5) * 0.05;
        point.vz += (Math.random() - 0.5) * 0.05;

        return point;
      });

      // Draw connections (optimized - only check nearby points)
      for (let i = 0; i < pointsRef.current.length; i++) {
        // Only check the next 5 points to reduce computation
        const maxChecks = Math.min(5, pointsRef.current.length - i - 1);
        for (let j = 1; j <= maxChecks; j++) {
          const point1 = pointsRef.current[i];
          const point2 = pointsRef.current[i + j];
          if (point1 && point2) {
            drawConnection(point1, point2);
          }
        }
      }

      // Draw points using the image or fallback to circles
      pointsRef.current.forEach((point) => {
        const projected = project3DTo2D(point.x, point.y, point.z);
        const size = point.size * projected.scale * 3; // Increased size for better visibility

        ctx.globalAlpha = point.opacity * projected.scale;
        
        if (particleImageRef.current) {
          // Draw with image
          ctx.drawImage(
            particleImageRef.current!,
            projected.x - size / 2,
            projected.y - size / 2,
            size,
            size,
          );
        } else {
          // Fallback to blue circles if image fails to load
          ctx.beginPath();
          ctx.arc(projected.x, projected.y, size / 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${point.opacity * projected.scale})`;
          ctx.fill();
        }
        
        ctx.globalAlpha = 1; // Reset alpha
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, mousePos, isReady]); // Added isReady to dependency array

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ 
        cursor: "none",
        backgroundColor: "transparent",
        minHeight: "100vh",
        minWidth: "100vw",
        zIndex: 1
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}
