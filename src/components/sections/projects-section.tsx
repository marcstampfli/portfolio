"use client";

import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState, useEffect, useMemo } from "react";
import { ProjectFilters } from "@/components/shared/project-filters";
import type { Project as PrismaProject } from ".prisma/client";
import { ProjectModal } from "@/components/shared/project-modal";
import { useQuery } from "@tanstack/react-query";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { ProjectTag } from "@/components/shared/project-tag";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import PlaceholderImage from "@/components/shared/placeholder-image";
import { isValidProjectImage } from "@/lib/utils";
import { logger } from "@/lib/logger";

interface Project {
  id: string;
  title: string;
  description: string;
  project_type: string;
  live_url: string | null;
  github_url: string | null;
  figma_url: string | null;
  images: string[] | null;
  tech_stack: string[];
  created_at: string;
  updated_at: string;
}

const Icons = {
  Github: dynamic(() => import("lucide-react").then((mod) => mod.Github)),
  Globe: dynamic(() => import("lucide-react").then((mod) => mod.Globe)),
  Figma: dynamic(() => import("lucide-react").then((mod) => mod.Figma)),
  AlertCircle: dynamic(() =>
    import("lucide-react").then((mod) => mod.AlertCircle),
  ),
  Loader2: dynamic(() => import("lucide-react").then((mod) => mod.Loader2)),
};

export function ProjectsSection() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<string | null>(null);
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Debounce search query to avoid too many re-renders
  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleImageError = (projectId: string, imagePath: string | undefined) => {
    // Log at debug level since fallback to placeholder is expected behavior
    logger.debug({
      message: "Project image not found, using placeholder",
      projectId,
      imagePath: imagePath || 'no image path'
    });
    setFailedImages(prev => {
      const next = new Set(prev);
      next.add(projectId);
      return next;
    });
  };

  const {
    data: projects = [] as Project[],
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data: unknown = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Expected array of projects");
      }

      const isProject = (obj: unknown): obj is Project =>
        typeof obj === "object" &&
        obj !== null &&
        typeof (obj as Project).id === "string" &&
        typeof (obj as Project).title === "string" &&
        typeof (obj as Project).description === "string" &&
        Array.isArray((obj as Project).tech_stack) &&
        Array.isArray((obj as Project).images);

      const validatedProjects = data.filter(isProject);
      return validatedProjects;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Get unique project types from projects
  const projectTypes = useMemo(() => {
    const uniqueTypes = Array.from(
      new Set(projects.map((project) => project.project_type)),
    );
    return ["all", ...uniqueTypes.sort()];
  }, [projects]);

  // Filter projects based on selected criteria
  const filteredProjects: Project[] = useMemo(() => {
    return projects.filter((project: Project) => {
      const matchesFilter =
        selectedFilter === "all" ||
        project.project_type.toLowerCase() === selectedFilter.toLowerCase();

      const matchesSearch = !debouncedSearch
        ? true
        : project.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          project.tech_stack.some((tech) =>
            tech.toLowerCase().includes(debouncedSearch.toLowerCase()),
          );

      const matchesType = !activeType || project.project_type === activeType;

      return matchesFilter && matchesSearch && matchesType;
    });
  }, [projects, selectedFilter, debouncedSearch, activeType]);

  // Reset visible projects when filters change
  useEffect(() => {
    setVisibleProjects(6);
  }, [selectedFilter, debouncedSearch, activeType]);

  const handleLoadMore = () => {
    setVisibleProjects((prev) => prev + 6);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
      className="relative"
    >
      <section
        id="projects"
        className="relative py-24 sm:py-32"
        aria-label="Projects"
      >
        <div className="container relative px-4 sm:px-6 lg:px-8">
          {/* Enhanced header section */}
          <div className="relative mx-auto mb-12 sm:mb-20 max-w-2xl text-center">
            <div
              className="absolute -top-16 left-1/2 h-40 w-[380px] -translate-x-1/2 bg-primary/20 blur-[120px]"
              aria-hidden="true"
            />
            <h2 className="relative mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold tracking-tight geist-sans md:text-5xl">
              <span className="bg-gradient-to-r from-primary via-primary/70 to-primary bg-[200%_auto] animate-text-shine bg-clip-text text-transparent">
                Work Throughout the Years
              </span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground geist-mono">
              Dive into my portfolio - a collection of web development, design,
              and creative projects.
            </p>
          </div>

          {/* Refined filters */}
          <div className="mb-12 sm:mb-16">
            <ProjectFilters
              activeFilter={selectedFilter}
              searchQuery={searchQuery}
              activeType={activeType}
              onFilterChange={setSelectedFilter}
              onSearchChange={setSearchQuery}
              onTypeChange={setActiveType}
              projectTypes={projectTypes}
              className="space-y-6 sm:space-y-8"
            />
          </div>

          {/* Projects grid with loading and error states */}
          <div className="space-y-8">
            <div
              className="relative grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
              role="list"
            >
              {isLoading && (
                <div
                  className="col-span-full flex flex-col items-center justify-center py-12"
                  role="status"
                >
                  <Icons.Loader2
                    className="h-8 w-8 animate-spin text-primary"
                    aria-hidden="true"
                  />
                  <p className="mt-4 text-muted-foreground geist-mono">
                    Loading projects...
                  </p>
                </div>
              )}
              {error && (
                <div
                  className="col-span-full flex flex-col items-center justify-center py-12 text-destructive"
                  role="alert"
                >
                  <Icons.AlertCircle className="h-8 w-8" aria-hidden="true" />
                  <p className="mt-4 geist-mono">
                    Failed to load projects. Please try again later.
                  </p>
                </div>
              )}
              {!isLoading && !error && filteredProjects.length === 0 && (
                <div className="col-span-full text-center py-12" role="status">
                  <p className="text-muted-foreground geist-mono">
                    No projects match your filters.
                  </p>
                </div>
              )}
              {!isLoading &&
                !error &&
                filteredProjects.length > 0 &&
                filteredProjects
                  .slice(0, visibleProjects)
                  .map((project, index) => {
                    return (
                      <div
                        key={project.id}
                        className="group relative opacity-0 animate-fade-in"
                        style={{
                          animationDelay: prefersReducedMotion
                            ? "0ms"
                            : `${index * 100}ms`,
                          animationFillMode: "forwards",
                        }}
                        role="listitem"
                      >
                        <div
                          onClick={() => setSelectedProject(project)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedProject(project);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`View details for ${project.title}`}
                          className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          {/* Project Image with enhanced overlay */}
                          <div className="absolute inset-0 w-full h-full relative">
                            {(() => {
                              const imagePath = project.images?.[0];
                              const shouldShowImage =
                                !failedImages.has(project.id) &&
                                imagePath &&
                                isValidProjectImage(imagePath) &&
                                imagePath.startsWith('/images/projects/');

                              return shouldShowImage ? (
                                <OptimizedImage
                                  src={imagePath}
                                  alt={`Screenshot of ${project.title}`}
                                  fill
                                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                                  className="relative object-cover transition-transform duration-500 group-hover:scale-105"
                                  priority={index < 3}
                                  quality={85}
                                  onError={() => handleImageError(project.id, imagePath)}
                                  placeholder="blur"
                                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJjdXJyZW50Q29sb3IiLz4="
                                />
                              ) : (
                                <PlaceholderImage
                                  fill
                                  animate={false}
                                  className="transition-transform duration-500 group-hover:scale-105"
                                />
                              );
                            })()}
                            <div
                              className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent"
                              aria-hidden="true"
                            />
                          </div>

                          {/* Project Info */}
                          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                            <h3 className="mb-2 text-lg sm:text-xl font-semibold text-foreground transition-colors group-hover:text-primary geist-sans">
                              {project.title}
                            </h3>
                            <p className="mb-4 line-clamp-2 text-xs sm:text-sm text-muted-foreground geist-mono">
                              {project.description}
                            </p>

                            {/* Tech Stack Tags */}
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {project.tech_stack
                                .slice(0, 3)
                                .map((tech, index) => (
                                  <ProjectTag
                                    key={`${project.id}-${tech}-${index}`}
                                  >
                                    {tech}
                                  </ProjectTag>
                                ))}
                              {project.tech_stack.length > 3 && (
                                <ProjectTag key={`${project.id}-tech-more`}>
                                  +{project.tech_stack.length - 3}
                                </ProjectTag>
                              )}
                            </div>

                            {/* Quick Links */}
                            <div className="absolute right-2 sm:right-4 top-2 sm:top-4 flex gap-1.5 sm:gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              {project.live_url && (
                                <a
                                  href={project.live_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-full bg-background/80 p-1.5 sm:p-2 text-muted-foreground backdrop-blur-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label="View Live Demo"
                                >
                                  <Icons.Globe
                                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                                    aria-hidden="true"
                                  />
                                </a>
                              )}
                              {project.github_url && (
                                <a
                                  href={project.github_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-full bg-background/80 p-1.5 sm:p-2 text-muted-foreground backdrop-blur-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label="View Source Code"
                                >
                                  <Icons.Github
                                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                                    aria-hidden="true"
                                  />
                                </a>
                              )}
                              {project.figma_url && (
                                <a
                                  href={project.figma_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-full bg-background/80 p-1.5 sm:p-2 text-muted-foreground backdrop-blur-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label="View Design"
                                >
                                  <Icons.Figma
                                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                                    aria-hidden="true"
                                  />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
            {!isLoading &&
              !error &&
              filteredProjects.length > visibleProjects && (
                <div
                  className="flex justify-center mt-8 opacity-0 animate-fade-in"
                  style={{
                    animationDelay: "300ms",
                    animationFillMode: "forwards",
                  }}
                >
                  <Button
                    onClick={handleLoadMore}
                    className="group relative overflow-hidden"
                  >
                    <span className="relative z-10 geist-mono">Load More Projects</span>
                    <div className="absolute inset-0 -z-10 bg-primary opacity-0 transition-opacity group-hover:opacity-10" />
                  </Button>
                </div>
              )}
          </div>

          {/* Project Modal */}
          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: projects.map((project, index) => ({
              "@type": "SoftwareSourceCode",
              position: index + 1,
              name: project.title,
              description: project.description,
              programmingLanguage: project.tech_stack,
              codeRepository: project.github_url || undefined,
              url: project.live_url || undefined,
              image: project.images?.[0] || undefined,
              author: {
                "@type": "Person",
                name: "Marc Stampfli",
              },
            })),
          }),
        }}
      />
    </motion.div>
  );
}
