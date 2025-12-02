"use client";

import { type ProjectWithTechStack } from "@/types";
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
import dynamic from "next/dynamic";

const Icons = {
  ExternalLink: dynamic(() =>
    import("lucide-react").then((mod) => mod.ExternalLink),
  ),
  Github: dynamic(() => import("lucide-react").then((mod) => mod.Github)),
};

interface ProjectModalProps {
  project: ProjectWithTechStack | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={() => onClose()}>
      <DialogContent className="relative">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>
            View details and information about {project.title}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Project Images */}
          <div className="space-y-4">
            {(() => {
              // Handle both string and string array for images
              const imageArray = Array.isArray(project.images) 
                ? project.images 
                : project.images 
                  ? [project.images]
                  : [];
              
              const primaryImage = imageArray[0];
              
              if (!primaryImage || !isValidProjectImage(primaryImage)) {
                return (
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <PlaceholderImage
                      fill
                      animate={false}
                      className="object-cover"
                    />
                  </div>
                );
              }

              return (
                <>
                  {/* Primary Image */}
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <OptimizedImage
                      src={primaryImage}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Additional Images */}
                  {imageArray.length > 1 && (
                    <div className="grid grid-cols-2 gap-2">
                      {imageArray.slice(1).map((imagePath: string, index: number) => (
                        isValidProjectImage(imagePath) && (
                          <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                            <OptimizedImage
                              src={imagePath}
                              alt={`${project.title} - Image ${index + 2}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </>
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
                {project.tech_stack.map((tech: string | { name: string }, index: number) => (
                  <ProjectTag key={`${project.id}-modal-${typeof tech === 'string' ? tech : tech.name}-${index}`}>
                    {typeof tech === 'string' ? tech : tech.name}
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
