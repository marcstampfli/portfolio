"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import {
  type ProjectWithTechStack,
  type ProjectResponse,
  getProjectTypeDisplayName,
} from "@/types";
import { getProjects } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/shared/optimized-image";
import PlaceholderImage from "@/components/shared/placeholder-image";
import { isValidProjectImage } from "@/lib/utils";
import { safeGetYear } from "@/lib/date-utils";
import {
  Github,
  ExternalLink,
  Figma,
  X,
  Info,
  Code,
  Calendar,
  User,
  ArrowRight,
  Layers,
} from "lucide-react";

// Hook to detect if device is touch/mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// 3D Tilt Card Component
function TiltCard({ 
  project, 
  index, 
  isActive, 
  onClick 
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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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
  }, [x, y, isMobile]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={`relative cursor-pointer group ${isActive ? 'z-20' : 'z-10'}`}
      style={isMobile ? {} : {
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
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
        damping: 25
      }}
      whileHover={isMobile ? {} : { 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
    >
      <div className="relative h-auto min-h-[360px] md:h-[420px] w-full bg-card border border-border/50 rounded-xl md:rounded-2xl overflow-hidden shadow-md md:shadow-lg group-hover:shadow-xl md:group-hover:shadow-2xl transition-all duration-300 flex flex-col"
           style={isMobile ? {} : { transform: "translateZ(50px)" }}>
        
        {/* Project Image */}
        <div className="relative h-36 md:h-44 overflow-hidden flex-shrink-0">
          {isValidProjectImage(project.images?.[0]) ? (
            <OptimizedImage
              src={project.images[0]}
              alt={project.title}
              width={400}
              height={200}
              className="w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <PlaceholderImage className="w-full h-full" />
          )}
          
          {/* Overlay - only on desktop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hidden md:block" />
          
          {/* Quick Actions - only visible on hover for desktop */}
          <div className="absolute top-2 right-2 md:top-3 md:right-3 flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            {project.live_url && (
              <Button size="sm" variant="secondary" className="h-7 w-7 md:h-8 md:w-8 p-0">
                <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            )}
            {project.github_url && (
              <Button size="sm" variant="secondary" className="h-7 w-7 md:h-8 md:w-8 p-0">
                <Github className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            )}
          </div>
          
          {/* Project Type Badge */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
              {getProjectTypeDisplayName(project.project_type)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-5 flex-1 flex flex-col">
          <div className="flex-1 space-y-2 md:space-y-3">
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                {project.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                {project.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1">
              {project.tech_stack?.slice(0, 3).map((tech, techIndex) => (
                <Badge key={`${tech}-${techIndex}`} variant="outline" className="text-[10px] md:text-xs px-1.5 py-0">
                  {typeof tech === 'string' ? tech : tech.name}
                </Badge>
              ))}
              {project.tech_stack?.length > 3 && (
                <Badge variant="outline" className="text-[10px] md:text-xs px-1.5 py-0">
                  +{project.tech_stack.length - 3}
                </Badge>
              )}
            </div>

            {/* Client & Status */}
            <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground">
              {project.client && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[80px] md:max-w-none">{project.client}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <div className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full ${
                  project.status === 'completed' ? 'bg-green-500' : 
                  project.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                <span className="capitalize">{project.status?.replace('_', ' ') || 'Unknown'}</span>
              </div>
            </div>
          </div>

          {/* View Details Button - Fixed at bottom */}
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border/30">
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full h-8 md:h-9 text-xs md:text-sm md:group-hover:bg-primary md:group-hover:text-primary-foreground transition-all duration-300"
            >
              View Details
              <ArrowRight className="ml-2 h-3.5 w-3.5 md:h-4 md:w-4 md:group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Slide-out Modal Component
function ProjectModal({ 
  project, 
  isOpen, 
  onClose 
}: { 
  project: ProjectWithTechStack | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Compensate for scrollbar
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!project || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l border-border shadow-2xl z-[101] flex flex-col overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            style={{ maxHeight: '100vh' }}
          >
            {/* Header - Fixed */}
            <div className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-b border-border p-6 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{project.title}</h2>
                  <p className="text-muted-foreground">{getProjectTypeDisplayName(project.project_type)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-muted">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
                 style={{ maxHeight: 'calc(100vh - 120px)' }}
            >
              <div className="p-6 space-y-8">
              {/* Hero Image */}
              <div className="relative h-64 rounded-xl overflow-hidden">
                {isValidProjectImage(project.images?.[0]) ? (
                  <OptimizedImage
                    src={project.images[0]}
                    alt={project.title}
                    width={800}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PlaceholderImage className="w-full h-full" />
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                {project.live_url && (
                  <Button asChild>
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                )}
                {project.github_url && (
                  <Button variant="outline" asChild>
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Source Code
                    </a>
                  </Button>
                )}
                {project.figma_url && (
                  <Button variant="outline" asChild>
                    <a href={project.figma_url} target="_blank" rel="noopener noreferrer">
                      <Figma className="mr-2 h-4 w-4" />
                      Design
                    </a>
                  </Button>
                )}
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About This Project</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
                {project.content && (
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
                )}
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tech Stack */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.map((tech, index) => (
                      <Badge key={`modal-${tech}-${index}`} variant="secondary">
                        {typeof tech === 'string' ? tech : tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Project Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Project Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    {project.client && (
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Client:</span>
                        <span>{project.client}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Status:</span>
                      <span className="capitalize">{project.status?.replace('_', ' ') || 'Unknown'}</span>
                    </div>
                    {project.developed_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Developed:</span>
                        <span>{safeGetYear(project.developed_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Images */}
              {project.images && project.images.length > 1 && (
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Project Gallery
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.images.slice(1).map((image, index) => (
                      isValidProjectImage(image) && (
                        <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                          <OptimizedImage
                            src={image}
                            alt={`${project.title} screenshot ${index + 2}`}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithTechStack | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [displayCount, setDisplayCount] = useState<number>(6);

  const {
    data: projects = [] as ProjectWithTechStack[],
    isLoading,
    error,
  } = useQuery<ProjectWithTechStack[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const data = await getProjects();
      return data.map(
        (project: ProjectResponse): ProjectWithTechStack => ({
          ...project,
          created_at: new Date(project.created_at),
          updated_at: new Date(project.updated_at),
          developed_at: project.developed_at
            ? new Date(project.developed_at)
            : null,
        })
      );
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
    if (activeFilter === 'all') return projects;
    return projects.filter(project => 
      project.project_type.toLowerCase() === activeFilter.toLowerCase()
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
    setDisplayCount(prev => prev + 6);
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
              <div className="h-8 bg-muted rounded-md w-48 mx-auto" />
              <div className="h-4 bg-muted rounded-md w-96 mx-auto" />
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
            <p className="text-muted-foreground mt-2">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="projects" className="relative py-24 sm:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              <span className="bg-gradient-to-r from-primary via-primary/70 to-primary bg-[200%_auto] animate-text-shine bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              A showcase of my work in web development, design, and digital experiences.
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-16 relative z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              variant={activeFilter === 'all' ? 'default' : 'ghost'}
              onClick={() => setActiveFilter('all')}
              className="rounded-full"
            >
              All Projects
            </Button>
            {projectTypes.map((type) => (
              <Button
                key={type}
                variant={activeFilter === type ? 'default' : 'ghost'}
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
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filter or check back later.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 perspective-1000">
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
              className="text-center mt-16"
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
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-muted-foreground">
                Showing {displayedProjects.length} of {filteredProjects.length} projects
                {activeFilter !== 'all' && ` in ${getProjectTypeDisplayName(activeFilter)}`}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Slide-out Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={closeModal}
      />
    </>
  );
}

export default ProjectsSection;
