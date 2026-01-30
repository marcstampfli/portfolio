"use client";

import { cn } from "@/lib/utils";

// Shimmer effect component
function Shimmer() {
  return (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  );
}

// Base skeleton card with shimmer
function SkeletonCard({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-muted/20 backdrop-blur-sm", className)}>
      <Shimmer />
      {children}
    </div>
  );
}

// Vertical Timeline/Experience skeleton
export function ExperienceSkeleton() {
  return (
    <section className="container relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="relative z-10 text-center mb-16 space-y-4">
        <div className="h-8 w-40 rounded-full bg-muted/30 mx-auto relative overflow-hidden">
          <Shimmer />
        </div>
        <div className="h-12 w-80 rounded-lg bg-muted/30 mx-auto relative overflow-hidden">
          <Shimmer />
        </div>
        <div className="h-6 w-96 max-w-full rounded-lg bg-muted/20 mx-auto relative overflow-hidden">
          <Shimmer />
        </div>
      </div>

      {/* Vertical Timeline skeleton */}
      <div className="max-w-4xl mx-auto">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`experience-skeleton-${index + 1}`}
            className="relative flex gap-6 md:gap-8"
          >
            {/* Timeline dot */}
            <div className="relative flex flex-col items-center">
              <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-4 border-muted/30 bg-background">
                <div className="h-5 w-5 rounded bg-muted/40 animate-pulse" />
              </div>
              {index < 2 && <div className="w-px flex-1 bg-muted/20" />}
            </div>
            
            {/* Content skeleton */}
            <div className={cn("flex-1", index < 2 ? "pb-12" : "pb-0")}>
              <SkeletonCard className="p-5 md:p-6 border border-primary/5">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                    <div className="space-y-2">
                      <div className="h-6 w-48 rounded bg-muted/40 relative overflow-hidden">
                        <Shimmer />
                      </div>
                      <div className="h-5 w-36 rounded bg-muted/30 relative overflow-hidden">
                        <Shimmer />
                      </div>
                    </div>
                    <div className="h-5 w-32 rounded bg-muted/20 relative overflow-hidden">
                      <Shimmer />
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-muted/20 relative overflow-hidden">
                      <Shimmer />
                    </div>
                    <div className="h-4 w-5/6 rounded bg-muted/20 relative overflow-hidden">
                      <Shimmer />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={`experience-tag-${i + 1}`}
                        className="h-6 w-16 rounded-full bg-muted/20 relative overflow-hidden"
                      >
                        <Shimmer />
                      </div>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div className="border-t border-muted/20 pt-4 space-y-2">
                    <div className="h-4 w-28 rounded bg-muted/30 relative overflow-hidden">
                      <Shimmer />
                    </div>
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={`experience-achievement-${i + 1}`}
                        className="h-4 w-full rounded bg-muted/20 relative overflow-hidden"
                      >
                        <Shimmer />
                      </div>
                    ))}
                  </div>
                </div>
              </SkeletonCard>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Projects grid skeleton
export function ProjectsSkeleton() {
  return (
    <section className="container relative py-24 px-4 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="relative z-10 text-center space-y-4 mb-16">
        <div className="h-10 w-48 rounded-lg bg-muted/30 mx-auto relative overflow-hidden">
          <Shimmer />
        </div>
        <div className="h-6 w-96 max-w-full rounded-lg bg-muted/20 mx-auto relative overflow-hidden">
          <Shimmer />
        </div>
      </div>

      {/* Filter buttons skeleton */}
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`project-filter-${i + 1}`}
            className="h-10 w-24 rounded-full bg-muted/20 relative overflow-hidden"
          >
            <Shimmer />
          </div>
        ))}
      </div>

      {/* Projects grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard
            key={`project-skeleton-${index + 1}`}
            className="h-[480px] border border-primary/5"
          >
            {/* Image placeholder */}
            <div className="h-48 bg-muted/30 relative overflow-hidden">
              <Shimmer />
            </div>
            
            <div className="p-6 space-y-4">
              {/* Title */}
              <div className="h-6 w-3/4 rounded bg-muted/30 relative overflow-hidden">
                <Shimmer />
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-muted/20 relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-4 w-5/6 rounded bg-muted/20 relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap pt-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`project-tag-${i + 1}`}
                    className="h-6 w-14 rounded-full bg-muted/20 relative overflow-hidden"
                  >
                    <Shimmer />
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <div className="h-9 w-24 rounded-lg bg-muted/20 relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-9 w-9 rounded-lg bg-muted/20 relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>
    </section>
  );
}

// Generic section skeleton with customizable height
export function SectionSkeleton({ 
  height = "h-96",
  showHeader = true 
}: { 
  height?: string;
  showHeader?: boolean;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4", height)}>
      {showHeader && (
        <div className="space-y-4 mb-8">
          <div className="h-10 w-48 rounded-lg bg-muted/30 relative overflow-hidden">
            <Shimmer />
          </div>
          <div className="h-6 w-72 rounded-lg bg-muted/20 relative overflow-hidden">
            <Shimmer />
          </div>
        </div>
      )}
      <SkeletonCard className={cn("w-full", showHeader ? "h-[calc(100%-5rem)]" : "h-full")} />
    </div>
  );
}
