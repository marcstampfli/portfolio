"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingImage } from "@/components/shared/loading-image";
import { type ProjectWithTechStack } from "@/types";

interface ProjectCardProps {
  project: ProjectWithTechStack;
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
      delay: index * 0.1,
    },
  }),
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  // Prioritize loading first 6 images
  const shouldPrioritize = index < 6;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className="group relative will-change-safe"
    >
      <Card className="overflow-hidden transition-all duration-300 will-change-safe hover:shadow-lg group-hover:scale-[1.02] dark:hover:shadow-primary/5 dark:border-border/50">
        <div className="relative aspect-video w-full overflow-hidden bg-muted dark:bg-muted/20">
          {project.images && project.images.length > 0 ? (
            <LoadingImage
              src={project.images[0]}
              alt={project.title}
              priority={shouldPrioritize}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm text-muted-foreground">
                No image available
              </span>
            </div>
          )}
        </div>

        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <CardTitle className="line-clamp-1 transition-colors">
              {project.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 transition-colors dark:text-muted-foreground/80">
              {project.description}
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech: string | { name: string }, index) => (
              <Badge 
                key={`${typeof tech === 'string' ? tech : tech.name}-${index}`} 
                variant="secondary"
                className="transition-colors dark:bg-muted/30 dark:text-foreground/80"
              >
                {typeof tech === 'string' ? tech : tech.name}
              </Badge>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            {project.live_url && (
              <Link
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary transition-colors hover:text-primary/80 hover:underline dark:text-primary/90"
              >
                View Live
              </Link>
            )}
            {project.github_url && (
              <Link
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary transition-colors hover:text-primary/80 hover:underline dark:text-primary/90"
              >
                GitHub
              </Link>
            )}
            {project.figma_url && (
              <Link
                href={project.figma_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary transition-colors hover:text-primary/80 hover:underline dark:text-primary/90"
              >
                Figma
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}