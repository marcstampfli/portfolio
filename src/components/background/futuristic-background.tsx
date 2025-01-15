"use client"

import React, { useEffect, useRef, useState } from "react"

interface GridPoint {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  size: number
  opacity: number
  hue: number
}

export function FuturisticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<GridPoint[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
  const animationFrameRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  // Initialize grid points
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const { width, height } = canvas.getBoundingClientRect()
    
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    setDimensions({ width: canvas.width, height: canvas.height })

    // Create 3D grid of points
    const points: GridPoint[] = []
    const numPoints = 300

    for (let i = 0; i < numPoints; i++) {
      const x = (Math.random() - 0.5) * width * 2
      const y = (Math.random() - 0.5) * height * 2
      const z = Math.random() * 1500 - 750

      points.push({
        x,
        y,
        z,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
        size: 1.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.2,
        hue: Math.random() * 40 - 20
      })
    }

    pointsRef.current = points
  }, [])

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || !pointsRef.current.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const project3DTo2D = (x: number, y: number, z: number) => {
      const fov = 1500
      const scale = fov / (fov + z)
      return {
        x: dimensions.width / 2 + x * scale,
        y: dimensions.height / 2 + y * scale,
        scale
      }
    }

    const drawConnection = (p1: GridPoint, p2: GridPoint) => {
      const proj1 = project3DTo2D(p1.x, p1.y, p1.z)
      const proj2 = project3DTo2D(p2.x, p2.y, p2.z)
      
      const dx = proj2.x - proj1.x
      const dy = proj2.y - proj1.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 200) {
        const avgScale = (proj1.scale + proj2.scale) / 2
        const opacity = (1 - distance / 200) * 0.1 * avgScale
        
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.lineWidth = avgScale * 0.5
        ctx.moveTo(proj1.x, proj1.y)
        ctx.lineTo(proj2.x, proj2.y)
        ctx.stroke()
      }
    }

    const animate = (timestamp: number) => {
      timeRef.current = timestamp * 0.001
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)
      ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0)

      // Update and draw points
      pointsRef.current = pointsRef.current.map(point => {
        // Update position with momentum
        point.x += point.vx
        point.y += point.vy
        point.z += point.vz

        // Boundary checks with wrapping
        const bound = 1000
        if (Math.abs(point.x) > bound) point.x = -point.x
        if (Math.abs(point.y) > bound) point.y = -point.y
        if (Math.abs(point.z) > bound) point.z = -point.z

        // Mouse interaction
        if (mousePos) {
          const projected = project3DTo2D(point.x, point.y, point.z)
          const dx = mousePos.x - projected.x
          const dy = mousePos.y - projected.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 250) {
            const force = (1 - distance / 250) * 0.015
            point.vx -= dx * force
            point.vy -= dy * force
            point.vz += force * 15
          }
        }

        // Speed damping
        point.vx *= 0.99
        point.vy *= 0.99
        point.vz *= 0.99

        // Add subtle flow
        point.vx += (Math.random() - 0.5) * 0.05
        point.vy += (Math.random() - 0.5) * 0.05
        point.vz += (Math.random() - 0.5) * 0.05

        return point
      })

      // Draw connections
      for (let i = 0; i < pointsRef.current.length; i++) {
        for (let j = i + 1; j < pointsRef.current.length; j++) {
          const point1 = pointsRef.current[i]
          const point2 = pointsRef.current[j]
          if (point1 && point2) {
            drawConnection(point1, point2)
          }
        }
      }

      // Draw points
      pointsRef.current.forEach(point => {
        const projected = project3DTo2D(point.x, point.y, point.z)
        const size = point.size * projected.scale
        
        // Point glow
        const gradient = ctx.createRadialGradient(
          projected.x, projected.y, 0,
          projected.x, projected.y, size * 2
        )
        gradient.addColorStop(0, `hsla(${210 + point.hue}, 100%, 70%, ${point.opacity * projected.scale})`)
        gradient.addColorStop(1, 'transparent')
        
        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(projected.x, projected.y, size * 2, 0, Math.PI * 2)
        ctx.fill()

        // Point core
        ctx.beginPath()
        ctx.fillStyle = `hsla(${210 + point.hue}, 100%, 70%, ${point.opacity * projected.scale * 2})`
        ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [dimensions, mousePos])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)
    setMousePos({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePos(null)
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ cursor: 'none' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  )
} 