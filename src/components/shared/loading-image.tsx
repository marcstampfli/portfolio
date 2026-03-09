"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useCallback } from "react";

interface LoadingImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}

const DEFAULT_SIZES =
  "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw";

export function LoadingImage({
  src,
  alt,
  priority = false,
  sizes = DEFAULT_SIZES,
}: LoadingImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
    setRetryCount(0);
  }, []);

  const handleError = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
      setIsLoading(true);
    } else {
      setError(true);
      setIsLoading(false);
    }
  }, [retryCount]);

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
        key={`${src}-${retryCount}`}
        src={src}
        alt={alt}
        fill
        className={`will-change-safe image-rendering-crisp object-cover transition-all duration-700 ease-out ${
          isLoading
            ? "scale-[1.02] blur-[2px] grayscale dark:brightness-75"
            : "scale-100 blur-0 grayscale-0 dark:brightness-90"
        } group-hover:hardware-accelerated group-hover:scale-110`}
        sizes={sizes}
        quality={85}
        onLoad={handleLoadComplete}
        onError={handleError}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="blur-backdrop absolute inset-0 flex items-center justify-center bg-background/40 dark:bg-background/60"
          >
            <div className="border-3 hardware-accelerated h-8 w-8 animate-spin rounded-full border-primary border-t-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
