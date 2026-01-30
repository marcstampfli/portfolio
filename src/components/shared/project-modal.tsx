"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import { type ProjectWithTechStack, getProjectTypeDisplayName } from "@/types";
import { OptimizedImage } from "@/components/shared/optimized-image";
import PlaceholderImage from "@/components/shared/placeholder-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isValidProjectImage } from "@/lib/utils";
import { safeGetYear } from "@/lib/date-utils";
import { Github, ExternalLink, Figma, X, Info, Code, Calendar, User, Layers } from "lucide-react";

interface ProjectModalProps {
  project: ProjectWithTechStack | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [mounted, setMounted] = useState(false);
  const isOpen = Boolean(project);
  const sanitizedContent = useMemo(() => {
    if (!project?.content) return "";
    return DOMPurify.sanitize(project.content);
  }, [project?.content]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "15px";

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  if (!project || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-0 top-0 z-[101] flex h-full w-full max-w-2xl flex-col overflow-hidden border-l border-border bg-background shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ maxHeight: "100vh" }}
          >
            <div className="sticky top-0 z-10 flex-shrink-0 border-b border-border bg-background/95 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{project.title}</h2>
                  <p className="text-muted-foreground">
                    {getProjectTypeDisplayName(project.project_type)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-muted">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div
              className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border flex-1 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 120px)" }}
            >
              <div className="space-y-8 p-6">
                <div className="relative h-64 overflow-hidden rounded-xl">
                  {isValidProjectImage(project.images?.[0]) ? (
                    <OptimizedImage
                      src={project.images[0]}
                      alt={project.title}
                      width={800}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <PlaceholderImage className="h-full w-full" />
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
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

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">About This Project</h3>
                  <p className="leading-relaxed text-muted-foreground">{project.description}</p>
                  {sanitizedContent && (
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-semibold">
                      <Code className="h-4 w-4" />
                      Technology Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack?.map((tech, index) => (
                        <Badge
                          key={`modal-${typeof tech === "string" ? tech : tech.name}-${index}`}
                          variant="secondary"
                        >
                          {typeof tech === "string" ? tech : tech.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-semibold">
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
                        <span className="capitalize">
                          {project.status?.replace("_", " ") || "Unknown"}
                        </span>
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

                {project.images && project.images.length > 1 && (
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 font-semibold">
                      <Layers className="h-4 w-4" />
                      Project Gallery
                    </h4>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {project.images.slice(1).map((image, index) =>
                        isValidProjectImage(image) ? (
                          <div
                            key={`${image}-${index}`}
                            className="relative h-48 overflow-hidden rounded-lg"
                          >
                            <OptimizedImage
                              src={image}
                              alt={`${project.title} screenshot ${index + 2}`}
                              width={400}
                              height={200}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                        ) : null
                      )}
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
