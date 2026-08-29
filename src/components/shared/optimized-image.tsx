"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BaseOptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  blurDataURL?: string;
  onError?: () => void;
}

type OptimizedImageProps = BaseOptimizedImageProps &
  ({ fill: true; width?: never; height?: never } | { fill?: false; width: number; height: number });

export function OptimizedImage({
  src,
  alt,
  className,
  blurDataURL,
  fill = false,
  onError,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        role="img"
        aria-label={alt + " image unavailable"}
        className={cn(
          "flex items-center justify-center bg-secondary/70 px-4 text-center text-xs text-muted-foreground",
          fill ? "absolute inset-0" : "relative min-h-32 w-full",
          className
        )}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={cn("object-cover", className)}
      onError={() => {
        setError(true);
        onError?.();
      }}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      {...props}
    />
  );
}
