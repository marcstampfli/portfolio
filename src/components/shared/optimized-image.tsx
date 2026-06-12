"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  blurDataURL?: string;
  fallback?: string;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  className,
  blurDataURL,
  fallback = "/images/particle.png",
  onError,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const fallbackTried = useRef(false);

  return (
    <Image
      src={error ? fallback : src}
      alt={alt}
      className={cn("object-cover", className)}
      onError={() => {
        if (!fallbackTried.current) {
          setError(true);
          fallbackTried.current = true;
          onError?.();
        }
      }}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      {...props}
    />
  );
}
