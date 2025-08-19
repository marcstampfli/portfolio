"use client";

import { motion, useReducedMotion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useCallback, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProjectWithTechStack } from "@/types/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/shared/optimized-image";
import PlaceholderImage from "@/components/shared/placeholder-image";
import { isValidProjectImage } from "@/lib/utils";
import { 
  Github, 
  ExternalLink, 
  Figma, 
  X,
  Play,
  Info,
  Code,
  Palette,
  Calendar,
  User,
  ArrowRight,
  Layers
} from "lucide-react";

interface APIProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  project_type: string;
  images: string[];
  live_url: string | null;
  github_url: string | null;
  figma_url: string | null;
  client: string | null;
  status: string;
  order: number;
  created_at: string;
  updated_at: string;
  developed_at: string | null;
  tech_stack: { name: string }[];
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
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={`relative cursor-pointer group ${isActive ? 'z-20' : 'z-10'}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isActive ? 1.05 : 1,
      }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <div className="relative h-[400px] w-full max-w-sm mx-auto bg-card border border-border/50 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300"
           style={{ transform: "translateZ(50px)" }}>
        
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          {isValidProjectImage(project.images?.[0]) ? (
            <OptimizedImage
              src={project.images[0]}
              alt={project.title}
              width={400}
              height={200}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <PlaceholderImage className="w-full h-full" />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.live_url && (
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            {project.github_url && (
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                <Github className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Project Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {project.project_type}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1">
            {project.tech_stack?.slice(0, 3).map((tech, techIndex) => (
              <Badge key={`${tech}-${techIndex}`} variant="outline" className="text-xs">
                {typeof tech === 'string' ? tech : tech.name}
              </Badge>
            ))}
            {project.tech_stack?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.tech_stack.length - 3}
              </Badge>
            )}
          </div>

          {/* Client & Status */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {project.client && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{project.client}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${
                project.status === 'completed' ? 'bg-green-500' : 
                project.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-500'
              }`} />
              <span className="capitalize">{project.status.replace('_', ' ')}</span>
            </div>
          </div>

          {/* View Details Button */}
          <Button 
            variant="ghost" 
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
          >
            View Details
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
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
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l border-border shadow-2xl z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{project.title}</h2>
                  <p className="text-muted-foreground">{project.project_type}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
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
                      <span className="capitalize">{project.status.replace('_', ' ')}</span>
                    </div>
                    {project.developed_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Developed:</span>
                        <span>{new Date(project.developed_at).getFullYear()}</span>
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function ProjectsSection() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedProject, setSelectedProject] = useState<ProjectWithTechStack | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const {
    data: projects = [] as ProjectWithTechStack[],
    isLoading,
    error,
  } = useQuery<ProjectWithTechStack[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error("Expected array of projects");

      const isAPIProject = (obj: unknown): obj is APIProject =>
        typeof obj === "object" &&
        obj !== null &&
        typeof (obj as APIProject).id === "string" &&
        typeof (obj as APIProject).title === "string";

      const validatedProjects = data.filter(isAPIProject);
      return validatedProjects.map((project: APIProject): ProjectWithTechStack => ({
        ...project,
        created_at: new Date(project.created_at),
        updated_at: new Date(project.updated_at),
        developed_at: project.developed_at ? new Date(project.developed_at) : null,
      }));
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Get project types for filtering
  const projectTypes = useMemo(() => {
    const types = new Set(projects.map(p => p.project_type));
    return Array.from(types).sort();
  }, [projects]);

  // Filter projects based on active filter
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter(project => 
      project.project_type.toLowerCase() === activeFilter.toLowerCase()
    );
  }, [projects, activeFilter]);

  const handleProjectClick = useCallback((project: ProjectWithTechStack) => {
    setSelectedProject(project);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

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
                Featured Projects
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              A showcase of my latest work in web development, design, and digital experiences.
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
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
                className="rounded-full capitalize"
              >
                {type.replace('_', ' ')}
              </Button>
            ))}
          </motion.div>

          {/* Projects Card Deck */}
          <div className="relative">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                {filteredProjects.map((project, index) => (
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

          {/* View All Projects CTA */}
          {filteredProjects.length > 6 && (
            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button variant="outline" size="lg" className="rounded-full">
                View All {projects.length} Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
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
