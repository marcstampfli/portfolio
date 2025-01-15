"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useThrottle } from "@/hooks/use-throttle"

interface ScrollSectionProps {
  children: React.ReactNode
  className?: string
  onLoadMore?: () => Promise<void>
  hasMore?: boolean
  loading?: boolean
  imageSrc?: string
  imageAlt?: string
}

export function ScrollSection({ 
  children, 
  className = "", 
  onLoadMore,
  hasMore = false,
  loading = false,
  imageSrc,
  imageAlt = "Content image"
}: ScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  
  // Configure scroll animation with container ref
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0])

  // Throttled scroll handler to prevent excessive calls
  const handleScroll = useCallback(async () => {
    if (!containerRef.current || !onLoadMore || !hasMore || loading || loadingMore) return

    const { bottom } = containerRef.current.getBoundingClientRect()
    const threshold = window.innerHeight + 100

    if (bottom <= threshold) {
      setLoadingMore(true)
      try {
        await onLoadMore()
      } finally {
        setLoadingMore(false)
      }
    }
  }, [onLoadMore, hasMore, loading, loadingMore])

  const throttledScroll = useThrottle(handleScroll, 200)

  // Attach scroll listener
  useEffect(() => {
    if (!onLoadMore || !hasMore) return

    window.addEventListener('scroll', throttledScroll)
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [onLoadMore, hasMore, throttledScroll])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      style={{ opacity, y }}
      className={`relative w-full ${className}`}
    >
      {imageSrc && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%23333333'/%3E%3C/svg%3E"
          />
        </div>
      )}

      {children}

      {(loading || loadingMore) && hasMore && (
        <div className="mt-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
    </motion.div>
  )
} 