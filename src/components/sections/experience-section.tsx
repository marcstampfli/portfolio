"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TimelineItem } from "@/components/timeline/timeline-item-vertical";
import { BackgroundEffect } from "@/components/timeline/background-effect";
import { generatePeriodString } from "@/lib/date-utils";
import { getExperiences } from "@/lib/actions";
import { type Experience } from "@/types";
import { Briefcase } from "lucide-react";

// Loading skeleton for vertical timeline
function TimelineSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="relative grid gap-4 md:gap-8 md:grid-cols-[1fr_auto_1fr] grid-cols-[auto_1fr]">
          {/* Left placeholder */}
          <div className="hidden md:block" />
          
          {/* Center dot */}
          <div className="relative flex flex-col items-center">
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-muted/30 bg-background animate-pulse">
              <Briefcase className="h-5 w-5 text-muted" />
            </div>
            {index < 2 && <div className="w-px flex-1 bg-muted/20" />}
          </div>
          
          {/* Right content skeleton */}
          <div className="pb-12 md:pb-16">
            <div className="rounded-2xl border bg-card p-6 space-y-4 animate-pulse">
              <div className="h-4 w-24 rounded bg-muted/30" />
              <div className="h-6 w-3/4 rounded bg-muted/40" />
              <div className="h-4 w-1/2 rounded bg-muted/30" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full rounded bg-muted/20" />
                <div className="h-4 w-5/6 rounded bg-muted/20" />
              </div>
              <div className="flex gap-2 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 w-16 rounded-full bg-muted/20" />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ExperienceSection() {
  const { data: experiences, isLoading, error } = useQuery<Experience[]>({
    queryKey: ["experiences"],
    queryFn: () => getExperiences(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (error) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <p className="text-destructive dark:text-destructive/90">
          {error instanceof Error ? error.message : "Failed to load experiences"}
        </p>
      </div>
    );
  }

  const sortedExperiences = experiences?.sort((a, b) => {
    const dateA = new Date(a.start_date).getTime();
    const dateB = new Date(b.start_date).getTime();
    return dateB - dateA; // Most recent first
  });

  return (
    <section
      id="experience"
      className="container relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      aria-labelledby="experience-heading"
    >
      <BackgroundEffect />
      
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center mb-16"
      >
        <div className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
          <Briefcase className="h-4 w-4" />
          <span>Career Journey</span>
        </div>
        <h2 
          id="experience-heading"
          className="text-3xl font-bold sm:text-4xl md:text-5xl"
        >
          <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text">
            Professional Experience
          </span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          A journey through my career, highlighting key roles and achievements 
          that have shaped my expertise.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto">
        {isLoading ? (
          <TimelineSkeleton />
        ) : (
          <div className="relative">
            {sortedExperiences?.map((experience, index) => {
              const dynamicPeriod = generatePeriodString(
                experience.start_date, 
                experience.end_date
              );
              const enhancedExperience = {
                ...experience,
                period: dynamicPeriod
              };
              
              return (
                <TimelineItem 
                  key={experience.id}
                  experience={enhancedExperience} 
                  index={index}
                  isLast={index === (sortedExperiences?.length ?? 0) - 1}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
