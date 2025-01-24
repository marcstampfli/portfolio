"use client";

import Image, { type ImageProps } from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string | StaticImport;
  alt: string;
  className?: string;
  blurDataURL?: string;
  fallback?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  blurDataURL,
  fallback = "/images/placeholder.svg",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const fallbackTried = useRef(false);

  return (
    <div className="inline-block relative">
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
          }
        }}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        {...props}
      />
    </div>
  );
}
