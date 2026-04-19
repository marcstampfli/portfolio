"use client";

import DOMPurify from "dompurify";
import { type ProjectWithTechStack, getProjectTypeDisplayName } from "@/types";
import { OptimizedImage } from "@/components/shared/optimized-image";
import PlaceholderImage from "@/components/shared/placeholder-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isValidProjectImage } from "@/lib/utils";
import { Calendar, ExternalLink, Figma, Github, Layers, User, X } from "lucide-react";

interface ProjectModalProps {
  project: ProjectWithTechStack | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const sanitizedContent = project?.content ? DOMPurify.sanitize(project.content) : "";

  return (
    <Dialog open={Boolean(project)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent position="right" className="overflow-hidden p-0" showClose={false}>
        {project ? (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-border/80 px-6 py-5 sm:px-7">
              <DialogHeader className="max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{getProjectTypeDisplayName(project.project_type)}</Badge>
                  <Badge variant="secondary">{project.status.replace("_", " ")}</Badge>
                </div>
                <DialogTitle>{project.title}</DialogTitle>
                <DialogDescription>{project.description}</DialogDescription>
              </DialogHeader>

              <DialogClose asChild>
                <button
                  type="button"
                  className="transition-theme inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/80 bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close project details</span>
                </button>
              </DialogClose>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-8 px-6 py-6 sm:px-7 sm:py-7">
                <div className="overflow-hidden rounded-lg border border-border/80">
                  <div className="relative aspect-[16/9] bg-secondary/60">
                    {isValidProjectImage(project.images?.[0]) ? (
                      <OptimizedImage
                        key={project.images[0] ?? project.id}
                        src={project.images[0]}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 42rem"
                        className="object-cover"
                      />
                    ) : (
                      <PlaceholderImage className="h-full w-full" />
                    )}
                  </div>
                </div>

                <DialogFooter className="border-b border-border/70 pb-6">
                  {project.live_url ? (
                    <Button asChild>
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                        Visit Live Project
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : null}
                  {project.github_url ? (
                    <Button variant="outline" asChild>
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        Source Code
                        <Github className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : null}
                  {project.figma_url ? (
                    <Button variant="outline" asChild>
                      <a href={project.figma_url} target="_blank" rel="noopener noreferrer">
                        Figma File
                        <Figma className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : null}
                </DialogFooter>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="space-y-6">
                    {sanitizedContent ? (
                      <div
                        className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:leading-7"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                      />
                    ) : null}

                    {project.images && project.images.length > 1 ? (
                      <section>
                        <h3 className="mb-4 font-display text-xl font-semibold tracking-[-0.03em] text-foreground">
                          Gallery
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {project.images.slice(1).map((image, index) =>
                            isValidProjectImage(image) ? (
                              <div
                                key={`${image}-${index}`}
                                className="overflow-hidden rounded-lg border border-border/80"
                              >
                                <div className="relative aspect-[4/3]">
                                  <OptimizedImage
                                    src={image}
                                    alt={`${project.title} screenshot ${index + 2}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                            ) : null
                          )}
                        </div>
                      </section>
                    ) : null}
                  </div>

                  <aside className="space-y-4">
                    <div className="surface-card p-5">
                      <h3 className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
                        Project Details
                      </h3>
                      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                        {project.client ? (
                          <div className="flex items-start gap-3">
                            <User className="mt-0.5 h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                Client
                              </p>
                              <p className="mt-1 text-foreground">{project.client}</p>
                            </div>
                          </div>
                        ) : null}

                        {project.year ? (
                          <div className="flex items-start gap-3">
                            <Calendar className="mt-0.5 h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                Year
                              </p>
                              <p className="mt-1 text-foreground">{project.year}</p>
                            </div>
                          </div>
                        ) : null}

                        <div className="flex items-start gap-3">
                          <Layers className="mt-0.5 h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                              Category
                            </p>
                            <p className="mt-1 text-foreground">
                              {getProjectTypeDisplayName(project.project_type)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {project.tech_stack?.length ? (
                      <div className="surface-card p-5">
                        <h3 className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
                          Stack
                        </h3>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.tech_stack.map((tech, index) => (
                            <Badge key={`${tech}-${index}`} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </aside>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
