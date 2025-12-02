"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "./project-card";
import { ScrollSection } from "@/components/shared/scroll-section";
import { useEffect, useState } from "react";

import { type ProjectWithTechStack } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

async function fetchProjects(): Promise<ProjectWithTechStack[]> {
  const response = await fetch("/api/projects", {
    headers: {
      "Accept": "application/json",
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  
  return response.json();
}

export function ProjectList() {
  const [mounted, setMounted] = useState(false);
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`initial-skeleton-${i}`}
            className="group relative"
          >
            <div className="overflow-hidden rounded-lg bg-muted/50 shadow transition-all dark:bg-muted/20">
              <div className="aspect-video w-full animate-pulse bg-muted dark:bg-muted/40" />
              <div className="space-y-4 p-6">
                <div className="space-y-2">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted dark:bg-muted/40" />
                  <div className="h-3 w-full animate-pulse rounded bg-muted dark:bg-muted/40" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-6 w-16 animate-pulse rounded bg-muted dark:bg-muted/40"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-[50vh] w-full items-center justify-center"
      >
        <p className="text-destructive dark:text-destructive/90">
          {error instanceof Error ? error.message : "Failed to load projects"}
        </p>
      </motion.div>
    );
  }

  return (
    <ScrollSection loading={isLoading}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {isLoading ? (
          <AnimatePresence mode="wait">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                variants={skeletonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="group relative"
              >
                <div className="overflow-hidden rounded-lg bg-muted/50 shadow transition-all dark:bg-muted/20">
                  <div className="aspect-video w-full animate-pulse bg-muted dark:bg-muted/40" />
                  <div className="space-y-4 p-6">
                    <div className="space-y-2">
                      <div className="h-4 w-2/3 animate-pulse rounded bg-muted dark:bg-muted/40" />
                      <div className="h-3 w-full animate-pulse rounded bg-muted dark:bg-muted/40" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className="h-6 w-16 animate-pulse rounded bg-muted dark:bg-muted/40"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait">
            {projects?.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
              />
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </ScrollSection>
  );
}