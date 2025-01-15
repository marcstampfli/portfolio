"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PlaceholderImageProps {
  text?: string
  className?: string
  size?: "sm" | "md" | "lg"
  animate?: boolean
}

export function PlaceholderImage({ text, className, size = "md", animate = true }: PlaceholderImageProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-16 h-16 text-sm",
    lg: "w-24 h-24 text-base"
  }

  // Get initials from text (max 2 characters)
  const initials = text
    ?.split(" ")
    .map(word => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl border border-primary/10",
        "bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5",
        "flex items-center justify-center font-medium text-primary/70",
        sizes[size],
        className
      )}
      initial={animate ? { opacity: 0, scale: 0.9 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      whileHover={animate ? { scale: 1.05 } : undefined}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-50 blur-xl">
        <div className="absolute inset-0 animate-pulse-slow bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0" />
      </div>

      {/* Optional text/initials */}
      {initials && (
        <span className="relative z-10">{initials}</span>
      )}

      {/* Decorative corner elements */}
      <div className="absolute -right-px -top-px h-4 w-4 rounded-bl-lg border-b border-l border-primary/20" />
      <div className="absolute -bottom-px -left-px h-4 w-4 rounded-tr-lg border-t border-r border-primary/20" />
    </motion.div>
  )
} 