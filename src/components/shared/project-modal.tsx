"use client";

import type { Project as PrismaProject } from ".prisma/client";

interface Project extends PrismaProject {
  tech_stack: string[];
  images: string[] | null;
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectTag } from "@/components/shared/project-tag";
import { OptimizedImage } from "@/components/shared/optimized-image";
import PlaceholderImage from "@/components/shared/placeholder-image";
import { Button } from "@/components/ui/button";
import { isValidProjectImage } from "@/lib/utils";
import { logger } from "@/lib/logger";
import dynamic from "next/dynamic";

const Icons = {
  ExternalLink: dynamic(() =>
    import("lucide-react").then((mod) => mod.ExternalLink),
  ),
  Github: dynamic(() => import("lucide-react").then((mod) => mod.Github)),
};

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={() => onClose()}>
      <DialogContent className="relative max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>
            View details and information about {project.title}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Project Image */}
          <div className="relative aspect-video overflow-hidden rounded-lg">
            {(() => {
              const imagePath = project.images?.[0];
              const handleImageError = () => {
                if (imagePath) {
                  logger.error({
                    message: "Failed to load project image in modal",
                    projectId: project.id,
                    imagePath,
                  });
                }
              };

              return imagePath && isValidProjectImage(imagePath) ? (
                <OptimizedImage
                  src={imagePath}
                  alt={project.title}
                  fill
                  className="object-cover"
                  onError={handleImageError}
                />
              ) : (
                <PlaceholderImage
                  fill
                  animate={false}
                  className="object-cover"
                />
              );
            })()}
          </div>

          {/* Project Description */}
          <div className="space-y-4">
            <p className="text-muted-foreground">{project.description}</p>

            {/* Tech Stack */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Tech Stack</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tech_stack.map((tech, index) => (
                  <ProjectTag key={`${project.id}-modal-${tech}-${index}`}>
                    {tech}
                  </ProjectTag>
                ))}
              </div>
            </div>

            {/* Project Links */}
            <div className="flex flex-wrap gap-3">
              {project.live_url && (
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icons.ExternalLink className="h-4 w-4" />
                    <span>Live Demo</span>
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icons.Github className="h-4 w-4" />
                    <span>Source Code</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
