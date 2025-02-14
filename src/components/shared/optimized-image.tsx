"use client";

import Image, { type ImageProps } from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
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
  fallback = "/images/placeholder.svg",
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const fallbackTried = useRef(false);

  return (
    <div className={cn("inline-block relative", props.fill && "w-full h-full")}>
      <Image
        src={error ? fallback : src}
        alt={alt}
        className={cn(
          "duration-700 ease-in-out",
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0",
          className,
        )}
        onLoad={() => {
          setIsLoading(false);
          setError(false);
        }}
        onError={() => {
          setIsLoading(false);
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
    </div>
  );
}
