"use client";

import Image, { type ImageProps } from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string | StaticImport;
  alt: string;
  className?: string;
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        {...props}
        className={cn(
          "object-cover transition-[filter] duration-500",
          isLoading && "blur-md",
        )}
        onLoad={() => setIsLoading(false)}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
      />
    </div>
  );
}
