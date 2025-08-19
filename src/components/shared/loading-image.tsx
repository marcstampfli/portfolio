"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";

interface LoadingImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}

export function LoadingImage({ src, alt, priority = false }: LoadingImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const maxRetries = 2;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset states when src changes
  useEffect(() => {
    setIsLoading(true);
    setError(false);
    setRetryCount(0);
  }, [src]);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
    setRetryCount(0);
  }, []);

  const handleError = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      // Add a small delay before retry
      setTimeout(() => {
        const timestamp = new Date().getTime();
        const retryUrl = `${src}?retry=${timestamp}`;
        setRetryCount(prev => prev + 1);
        // Force re-render of Image component
        setIsLoading(true);
      }, 1000);
    } else {
      setError(true);
      setIsLoading(false);
    }
  }, [retryCount, src]);

  // Generate sizes based on breakpoints
  const sizes = "(max-width: 640px) 100vw, " + 
                "(max-width: 768px) 50vw, " +
                "(max-width: 1024px) 33vw, " +
                "(max-width: 1280px) 25vw, " +
                "20vw";

  // Show a static placeholder during SSR
  if (!mounted) {
    return (
      <div className="absolute inset-0 bg-muted/50 dark:bg-muted/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-full w-full items-center justify-center bg-muted/50 dark:bg-muted/20"
      >
        <span className="text-sm text-muted-foreground">Failed to load image</span>
      </motion.div>
    );
  }

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        className={`will-change-safe image-rendering-crisp object-cover transition-all duration-700 ease-out ${
          isLoading
            ? "scale-[1.02] blur-[2px] grayscale dark:brightness-75"
            : "scale-100 blur-0 grayscale-0 dark:brightness-90"
        } group-hover:scale-110 group-hover:hardware-accelerated ${
          mounted && theme === 'dark' ? 'dark:contrast-100' : ''
        }`}
        sizes={sizes}
        quality={85}
        onLoadingComplete={handleLoadComplete}
        onError={handleError}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
      <AnimatePresence>
        {isLoading && mounted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center bg-background/40 dark:bg-background/60 blur-backdrop"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent hardware-accelerated" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}