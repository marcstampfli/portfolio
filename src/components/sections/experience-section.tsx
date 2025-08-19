"use client";

import { useQuery } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TimelineItem } from "@/components/timeline/timeline-item";
import { TimelineProgress } from "@/components/timeline/timeline-progress";
import { BackgroundEffect } from "@/components/timeline/background-effect";
import React from 'react';

interface Experience {
  id: string;
  title: string;
  company: string;
  position: string;
  period: string;
  description: string;
  tech_stack: string[];
  achievements: string[];
  start_date: string;
  end_date: string | null;
}

async function fetchExperiences(): Promise<Experience[]> {
  const response = await fetch("/api/experiences", {
    headers: {
      "Accept": "application/json",
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch experiences");
  }
  
  const experiences = await response.json();
    return experiences.map((experience: Experience) => ({
      ...experience,
      start_date: new Date(experience.start_date).toISOString(),
      end_date: experience.end_date ? new Date(experience.end_date).toISOString() : null,
    }));
}

export function ExperienceSection() {
  const { data: experiences, isLoading, error } = useQuery<Experience[]>({ 
    queryKey: ["experiences"],
    queryFn: fetchExperiences,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const timeline = timelineRef.current;
    if (!timeline) return;
    setStartX(e.pageX - timeline.offsetLeft);
    setScrollLeft(timeline.scrollLeft);
  };

  const handlePointerLeave = () => {
    setIsDragging(false);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const timeline = timelineRef.current;
    if (!timeline) return;
    const x = e.pageX - timeline.offsetLeft;
    const walk = (x - startX) * 1; // scroll-fast
    timeline.scrollLeft = scrollLeft - walk;
  };

  if (error) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <p className="text-destructive dark:text-destructive/90">
          {error instanceof Error ? error.message : "Failed to load experiences"}
        </p>
      </div>
    );
  }

  return (
    <section
      id="experience"
      className="container relative mt-32 px-4 sm:px-6 lg:px-8"
      style={{ perspective: "1000px" }}
    >
      <BackgroundEffect />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <h2 className="text-3xl font-bold sm:text-4xl">Experience</h2>
        <p className="mt-4 text-muted-foreground">
          My professional journey and work experience.
        </p>
      </motion.div>

      <div className="relative mt-16 overflow-hidden">
        <TimelineProgress isLoading={isLoading} />
        <div
          ref={timelineRef}
          className="relative z-10 flex gap-8 overflow-x-auto pb-12 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40"
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerLeave}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          style={{ touchAction: 'pan-y', position: 'relative' }}
        >
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex-none animate-pulse opacity-60 snap-center w-[calc(100vw-3rem)] md:w-[600px]"
              >
                <div className="w-full space-y-4">
                  <div className="h-6 w-32 rounded bg-muted dark:bg-muted/40" />
                  <div className="h-6 w-full rounded bg-muted dark:bg-muted/40" />
                  <div className="h-24 w-full rounded bg-muted dark:bg-muted/40" />
                  <div className="h-6 w-32 rounded bg-muted dark:bg-muted/40" />
                </div>
              </div>
            ))
          ) : (
            experiences?.sort((a, b) => {
              const dateA = new Date(a.end_date ? a.end_date : a.start_date);
              const dateB = new Date(b.end_date ? b.end_date : b.start_date);
              return dateB.getTime() - dateA.getTime(); // Latest first
            }).map((experience: Experience, index) => (
              <motion.div
                key={experience.id}
                className="flex-none snap-center w-[calc(100vw-3rem)] md:w-[600px] flex-shrink-0"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TimelineItem experience={experience} index={index} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
