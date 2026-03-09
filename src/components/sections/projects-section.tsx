"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { type ProjectWithTechStack, getProjectTypeDisplayName } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/shared/section-header";
import { OptimizedImage } from "@/components/shared/optimized-image";
import PlaceholderImage from "@/components/shared/placeholder-image";
import { ProjectModal } from "@/components/shared/project-modal";
import { isValidProjectImage } from "@/lib/utils";
import { ArrowRight, ExternalLink, FolderArchive, Github, Star } from "lucide-react";

interface ProjectsSectionProps {
  projects: ProjectWithTechStack[];
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: ProjectWithTechStack;
  index: number;
  onOpen: (_project: ProjectWithTechStack) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="surface-card group flex h-full flex-col overflow-hidden"
    >
      <button
        type="button"
        className="flex h-full flex-col text-left"
        onClick={() => onOpen(project)}
      >
        <div className="relative aspect-[16/10] border-b border-border/80 bg-secondary/60">
          {isValidProjectImage(project.images?.[0]) ? (
            <OptimizedImage
              key={project.images[0]}
              src={project.images[0]}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <PlaceholderImage className="h-full w-full" />
          )}

          {/* dark gradient so badges are always readable over any image */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center rounded-sm bg-black/50 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                {getProjectTypeDisplayName(project.project_type)}
              </span>
              {project.featured ? (
                <span className="inline-flex items-center rounded-sm bg-primary px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
                  Featured
                </span>
              ) : null}
            </div>
            <div className="flex gap-2">
              {project.live_url ? (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="transition-theme inline-flex h-8 w-8 items-center justify-center rounded-sm border border-white/20 bg-black/50 text-white backdrop-blur-sm hover:border-white/40 hover:bg-black/70"
                  aria-label={`Open ${project.title} live project`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
              {project.github_url ? (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="transition-theme inline-flex h-8 w-8 items-center justify-center rounded-sm border border-white/20 bg-black/50 text-white backdrop-blur-sm hover:border-white/40 hover:bg-black/70"
                  aria-label={`Open ${project.title} source code`}
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div>
            <h3 className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
              {project.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{project.description}</p>
          </div>

          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {project.tech_stack.slice(0, 4).map((tech, techIndex) => (
              <Badge key={`${tech}-${techIndex}`} variant="secondary">
                {tech}
              </Badge>
            ))}
            {project.tech_stack.length > 4 ? (
              <Badge variant="outline">+{project.tech_stack.length - 4} more</Badge>
            ) : null}
          </div>

          <div className="mt-auto border-t border-border/70 pt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {project.client ?? "Independent"}
                </p>
                {project.year ? (
                  <p className="text-xs text-muted-foreground">{project.year}</p>
                ) : null}
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary">
                <span className="link">View Case</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </button>
    </motion.article>
  );
}

function ArchiveRow({
  project,
  onOpen,
}: {
  project: ProjectWithTechStack;
  onOpen: (_project: ProjectWithTechStack) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className="transition-theme flex w-full items-center justify-between gap-4 rounded-sm border border-border/70 bg-background/40 px-4 py-4 text-left hover:border-primary/30 hover:bg-background/70"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground">{project.title}</h3>
          <Badge variant="outline">{getProjectTypeDisplayName(project.project_type)}</Badge>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
          {project.description || "Open project details"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {project.year ? <span>{project.year}</span> : null}
        <ArrowRight className="h-4 w-4" />
      </div>
    </button>
  );
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectWithTechStack | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAllArchive, setShowAllArchive] = useState(false);

  const projectTypes = useMemo(() => {
    const types = new Set(projects.map((project) => project.project_type).filter(Boolean));
    return Array.from(types).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return projects;
    }

    return projects.filter(
      (project) => project.project_type.toLowerCase() === activeFilter.toLowerCase()
    );
  }, [activeFilter, projects]);

  const featuredProjects = useMemo(
    () => filteredProjects.filter((project) => project.featured),
    [filteredProjects]
  );

  const archiveProjects = useMemo(
    () => filteredProjects.filter((project) => !project.featured),
    [filteredProjects]
  );

  const archivePreviewCount = activeFilter === "all" ? 3 : 6;

  const visibleArchiveProjects = useMemo(() => {
    if (showAllArchive || activeFilter !== "all") {
      return archiveProjects;
    }

    return archiveProjects.slice(0, archivePreviewCount);
  }, [activeFilter, archivePreviewCount, archiveProjects, showAllArchive]);

  const hasHiddenArchiveProjects =
    activeFilter === "all" && archiveProjects.length > archivePreviewCount;

  const visibleSelectedProject = useMemo(() => {
    if (!selectedProject) {
      return null;
    }

    return filteredProjects.some((project) => project.id === selectedProject.id)
      ? selectedProject
      : null;
  }, [filteredProjects, selectedProject]);

  return (
    <>
      <section id="projects" className="section-shell relative" aria-labelledby="projects-heading">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <SectionHeader
              titleId="projects-heading"
              eyebrow="Projects"
              title="Client work, personal projects, and experiments."
              subtitle="Featured work up top. Everything else is in the archive — filter by type to dig in."
              titleClassName="text-3xl sm:text-4xl lg:text-5xl"
              className="max-w-3xl"
            />

            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                className="rounded-sm"
                onClick={() => {
                  setActiveFilter("all");
                  setShowAllArchive(false);
                }}
              >
                All
              </Button>
              {projectTypes.map((type) => (
                <Button
                  key={type}
                  variant={activeFilter === type ? "default" : "outline"}
                  className="rounded-sm"
                  onClick={() => {
                    setActiveFilter(type);
                    setShowAllArchive(true);
                  }}
                >
                  {getProjectTypeDisplayName(type)}
                </Button>
              ))}
            </div>
          </motion.div>

          {filteredProjects.length === 0 ? (
            <div className="surface-panel mt-10 p-8 sm:p-10">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
                No matching projects.
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                Try another filter.
              </p>
            </div>
          ) : (
            <div className="mt-10 space-y-12">
              {featuredProjects.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Featured Case Studies
                    </p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {featuredProjects.map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        onOpen={setSelectedProject}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {archiveProjects.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <FolderArchive className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Project Archive
                    </p>
                  </div>
                  <div className="surface-panel space-y-3 p-4 sm:p-5">
                    {visibleArchiveProjects.map((project) => (
                      <ArchiveRow key={project.id} project={project} onOpen={setSelectedProject} />
                    ))}
                  </div>
                  {hasHiddenArchiveProjects ? (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-muted-foreground">
                        Showing {visibleArchiveProjects.length} of {archiveProjects.length} archived
                        projects.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setShowAllArchive((current) => !current)}
                      >
                        {showAllArchive ? "Hide Archive" : "Show Full Archive"}
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
        </Container>
      </section>

      <ProjectModal project={visibleSelectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}

export default ProjectsSection;
