"use client"

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion"
import { Github, Globe, Figma, AlertCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { ProjectFilters } from "@/components/shared/project-filters"
import { type Project } from "@/types/prisma"
import { ProjectModal } from "@/components/shared/project-modal"
import Particles from "@tsparticles/react"
import { getProjects } from "@/app/actions"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { ProjectCategory } from "@/data/projects"
import { FuturisticBackground } from "../background/futuristic-background"

export function ProjectsSection() {
  const prefersReducedMotion = useReducedMotion()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<Lowercase<ProjectCategory>>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTech, setActiveTech] = useState<string | null>(null)

  const { data: projects = [], isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const data = await getProjects();
      if (!data) {
        throw new Error('Failed to fetch projects');
      }
      return data as Project[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get unique tech stack items from all projects
  const availableTechs = Array.from(
    new Set(projects.flatMap((project: Project) => project.tech_stack))
  ).sort();

  const filteredProjects = projects.filter((project: Project) => {
    const matchesFilter = selectedFilter === "all" || project.tags.includes(selectedFilter);
    const matchesSearch = !searchQuery || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTech = !activeTech || project.tech_stack.includes(activeTech);
    return matchesFilter && matchesSearch && matchesTech;
  });

  return (
    <LazyMotion features={domAnimation}>
      <section 
        id="projects" 
        className="relative py-24 sm:py-32"
        aria-label="Projects"
      >
        
        <FuturisticBackground />
        {/* Refined background pattern */}
        {!prefersReducedMotion && (
          <Particles
            className="absolute inset-0 -z-10"
            id="tsparticles-projects"
            options={{
              fullScreen: false,
              background: {
                color: {
                  value: "transparent",
                },
              },
              fpsLimit: 60,
              particles: {
                color: {
                  value: "#3b82f6",
                },
                links: {
                  color: "#3b82f6",
                  distance: 150,
                  enable: true,
                  opacity: 0.15,
                  width: 1,
                },
                move: {
                  enable: true,
                  speed: 0.2,
                  random: false,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                  },
                  value: 40,
                },
                opacity: {
                  value: 0.2,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 2 },
                },
              },
              detectRetina: true,
            }}
          />
        )}

        <div className="container relative px-4 sm:px-6 lg:px-8">
          {/* Enhanced header section */}
          <m.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mb-12 sm:mb-20 max-w-2xl text-center"
          >
            <div className="absolute -top-16 left-1/2 h-40 w-[380px] -translate-x-1/2 bg-primary/20 blur-[120px]" aria-hidden="true" />
            <h2 className="relative mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold tracking-tight font-heading md:text-5xl">
              <span className="bg-gradient-to-r from-primary via-primary/70 to-primary bg-[200%_auto] animate-text-shine bg-clip-text text-transparent">
                Work Throughout the Years
              </span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Dive into my portfolio - a collection of web development, design, and creative projects.
            </p>
          </m.div>

          {/* Refined filters */}
          <div className="mb-12 sm:mb-16">
            <ProjectFilters
              activeFilter={selectedFilter}
              searchQuery={searchQuery}
              activeTech={activeTech}
              onFilterChange={setSelectedFilter}
              onSearchChange={setSearchQuery}
              onTechChange={setActiveTech}
              availableTechs={availableTechs}
              className="space-y-6 sm:space-y-8"
            />
          </div>

          {/* Enhanced projects grid */}
          <div 
            className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3" 
            role="list"
          >
            {isLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12" role="status">
                <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
                <p className="mt-4 text-muted-foreground">Loading projects...</p>
              </div>
            ) : error ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-destructive" role="alert">
                <AlertCircle className="h-8 w-8" aria-hidden="true" />
                <p className="mt-4">Failed to load projects. Please try again later.</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-12" role="status">
                <p className="text-muted-foreground">No projects match your filters.</p>
              </div>
            ) : (
              filteredProjects.map((project: Project, index: number) => (
                <m.div
                  key={project.id}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.5, 
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="group relative"
                  role="listitem"
                >
                  {/* Project card */}
                  <div
                    onClick={() => setSelectedProject(project)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedProject(project)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${project.title}`}
                    className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {/* Project Image with enhanced overlay */}
                    <div className="absolute inset-0">
                      <Image
                        src={project.images?.[0] ?? '/images/placeholder.jpg'}
                        alt={`Screenshot of ${project.title}`}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={index < 3}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" aria-hidden="true" />
                    </div>

                    {/* Project Info with refined typography */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                      <h3 className="mb-2 text-lg sm:text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                        {project.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-xs sm:text-sm text-muted-foreground">
                        {project.description}
                      </p>

                      {/* Enhanced tags */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {project.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] sm:text-xs text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] sm:text-xs text-primary">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Quick Links with refined hover states */}
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
                            <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-background/80 p-1.5 sm:p-2 text-muted-foreground backdrop-blur-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="View GitHub Repository"
                          >
                            <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                          </a>
                        )}
                        {project.figma_url && (
                          <a
                            href={project.figma_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-background/80 p-1.5 sm:p-2 text-muted-foreground backdrop-blur-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="View Figma Design"
                          >
                            <Figma className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </m.div>
              ))
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
            "itemListElement": projects.map((project, index) => ({
              "@type": "SoftwareSourceCode",
              "position": index + 1,
              "name": project.title,
              "description": project.description,
              "programmingLanguage": project.tech_stack,
              "codeRepository": project.github_url,
              "url": project.live_url,
              "image": project.images[0],
              "author": {
                "@type": "Person",
                "name": "Marc Stampfli"
              }
            }))
          })
        }}
      />
    </LazyMotion>
  )
} 