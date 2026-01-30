"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  type ProjectWithTechStack,
  type ProjectResponse,
  getProjectTypeDisplayName,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/shared/optimized-image";
import PlaceholderImage from "@/components/shared/placeholder-image";
import { ProjectModal } from "@/components/shared/project-modal";
import { isValidProjectImage } from "@/lib/utils";
import { Github, ExternalLink, User, ArrowRight } from "lucide-react";

// Hook to detect if device is touch/mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

// 3D Tilt Card Component
function TiltCard({
  project,
  index,
  isActive,
  onClick,
}: {
  project: ProjectWithTechStack;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Disable 3D effect on mobile
      if (isMobile || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;

      x.set(xPct);
      y.set(yPct);
    },
    [x, y, isMobile]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={`group relative cursor-pointer ${isActive ? "z-20" : "z-10"}`}
      style={
        isMobile
          ? {}
          : {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isActive ? 1.02 : 1,
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        type: "spring",
        stiffness: 150,
        damping: 25,
      }}
      whileHover={
        isMobile
          ? {}
          : {
              scale: 1.01,
              transition: { duration: 0.2 },
            }
      }
    >
      <div
        className="relative flex h-auto min-h-[360px] w-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-md transition-all duration-300 group-hover:shadow-xl md:h-[420px] md:rounded-2xl md:shadow-lg md:group-hover:shadow-2xl"
        style={isMobile ? {} : { transform: "translateZ(50px)" }}
      >
        {/* Project Image */}
        <div className="relative h-36 flex-shrink-0 overflow-hidden md:h-44">
          {isValidProjectImage(project.images?.[0]) ? (
            <OptimizedImage
              src={project.images[0]}
              alt={project.title}
              width={400}
              height={200}
              className="h-full w-full object-cover transition-transform duration-500 md:group-hover:scale-110"
            />
          ) : (
            <PlaceholderImage className="h-full w-full" />
          )}

          {/* Overlay - only on desktop */}
          <div className="absolute inset-0 hidden bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 md:block md:group-hover:opacity-100" />

          {/* Quick Actions - only visible on hover for desktop */}
          <div className="absolute right-2 top-2 flex gap-2 transition-opacity duration-300 md:right-3 md:top-3 md:opacity-0 md:group-hover:opacity-100">
            {project.live_url && (
              <Button size="sm" variant="secondary" className="h-7 w-7 p-0 md:h-8 md:w-8">
                <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            )}
            {project.github_url && (
              <Button size="sm" variant="secondary" className="h-7 w-7 p-0 md:h-8 md:w-8">
                <Github className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            )}
          </div>

          {/* Project Type Badge */}
          <div className="absolute left-2 top-2 md:left-3 md:top-3">
            <Badge variant="secondary" className="bg-background/80 text-xs backdrop-blur-sm">
              {getProjectTypeDisplayName(project.project_type)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4 md:p-5">
          <div className="flex-1 space-y-2 md:space-y-3">
            <div>
              <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors duration-300 group-hover:text-primary md:text-lg">
                {project.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground md:text-sm">
                {project.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1">
              {project.tech_stack?.slice(0, 3).map((tech, techIndex) => (
                <Badge
                  key={`${tech}-${techIndex}`}
                  variant="outline"
                  className="px-1.5 py-0 text-[10px] md:text-xs"
                >
                  {typeof tech === "string" ? tech : tech.name}
                </Badge>
              ))}
              {project.tech_stack?.length > 3 && (
                <Badge variant="outline" className="px-1.5 py-0 text-[10px] md:text-xs">
                  +{project.tech_stack.length - 3}
                </Badge>
              )}
            </div>

            {/* Client & Status */}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground md:text-xs">
              {project.client && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="max-w-[80px] truncate md:max-w-none">{project.client}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <div
                  className={`h-1.5 w-1.5 rounded-full md:h-2 md:w-2 ${
                    project.status === "completed"
                      ? "bg-green-500"
                      : project.status === "in_progress"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                  }`}
                />
                <span className="capitalize">{project.status?.replace("_", " ") || "Unknown"}</span>
              </div>
            </div>
          </div>

          {/* View Details Button - Fixed at bottom */}
          <div className="mt-3 border-t border-border/30 pt-3 md:mt-4 md:pt-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full text-xs transition-all duration-300 md:h-9 md:text-sm md:group-hover:bg-primary md:group-hover:text-primary-foreground"
            >
              View Details
              <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-300 md:h-4 md:w-4 md:group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<ProjectWithTechStack | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [displayCount, setDisplayCount] = useState<number>(6);

  const {
    data: projects = [] as ProjectWithTechStack[],
    isLoading,
    error,
  } = useQuery<ProjectWithTechStack[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects", {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = (await response.json()) as {
        success: boolean;
        data?: ProjectResponse[];
        error?: string;
      };

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch projects");
      }

      return data.data.map((project: ProjectResponse): ProjectWithTechStack => ({
        ...project,
        created_at: new Date(project.created_at),
        updated_at: new Date(project.updated_at),
        developed_at: project.developed_at ? new Date(project.developed_at) : null,
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get project types for filtering
  const projectTypes = useMemo(() => {
    const types = new Set(projects.map((p) => p.project_type).filter(Boolean));
    return Array.from(types).sort();
  }, [projects]);

  // Filter projects based on active filter
  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter(
      (project) => project.project_type.toLowerCase() === activeFilter.toLowerCase()
    );
  }, [projects, activeFilter]);

  // Projects to display based on pagination
  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, displayCount);
  }, [filteredProjects, displayCount]);

  const hasMoreProjects = filteredProjects.length > displayCount;

  const handleProjectClick = useCallback((project: ProjectWithTechStack) => {
    setSelectedProject(project);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const loadMoreProjects = useCallback(() => {
    setDisplayCount((prev) => prev + 6);
  }, []);

  // Reset display count when filter changes
  useEffect(() => {
    setDisplayCount(6);
  }, [activeFilter]);

  if (isLoading) {
    return (
      <section className="relative py-24 sm:py-32">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="mx-auto h-8 w-48 rounded-md bg-muted" />
              <div className="mx-auto h-4 w-96 rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-24 sm:py-32">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Unable to load projects</h2>
            <p className="mt-2 text-muted-foreground">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="projects" className="relative overflow-hidden py-24 sm:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="bg-primary/3 absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="animate-text-shine bg-gradient-to-r from-primary via-primary/70 to-primary bg-[200%_auto] bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              A showcase of my work in web development, design, and digital experiences.
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            className="relative z-30 mb-16 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              variant={activeFilter === "all" ? "default" : "ghost"}
              onClick={() => setActiveFilter("all")}
              className="rounded-full"
            >
              All Projects
            </Button>
            {projectTypes.map((type) => (
              <Button
                key={type}
                variant={activeFilter === type ? "default" : "ghost"}
                onClick={() => setActiveFilter(type)}
                className="rounded-full"
              >
                {getProjectTypeDisplayName(type)}
              </Button>
            ))}
          </motion.div>

          {/* Projects Card Deck */}
          <div className="relative z-10">
            {filteredProjects.length === 0 ? (
              <motion.div
                className="py-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="mb-2 text-xl font-semibold">No projects found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filter or check back later.
                </p>
              </motion.div>
            ) : (
              <div className="perspective-1000 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                {displayedProjects.map((project, index) => (
                  <TiltCard
                    key={project.id}
                    project={project}
                    index={index}
                    isActive={selectedProject?.id === project.id}
                    onClick={() => handleProjectClick(project)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMoreProjects && (
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="rounded-full"
                onClick={loadMoreProjects}
              >
                Load More Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Projects Counter */}
          {filteredProjects.length > 0 && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-muted-foreground">
                Showing {displayedProjects.length} of {filteredProjects.length} projects
                {activeFilter !== "all" && ` in ${getProjectTypeDisplayName(activeFilter)}`}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Slide-out Modal */}
      <ProjectModal project={selectedProject} onClose={closeModal} />
    </>
  );
}

export default ProjectsSection;
