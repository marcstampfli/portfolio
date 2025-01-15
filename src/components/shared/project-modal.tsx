"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Project } from "@/types/prisma"
import { Github, Globe, Figma } from "lucide-react"
import Image from "next/image"

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

function TechStack({ techStack }: { techStack: string[] }) {
  if (!techStack?.length) {
    return null
  }

  return (
    <div className="mb-6">
      <h4 className="mb-2 font-semibold">Tech Stack</h4>
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex gap-4">
      {project.live_url && (
        <a
          href={project.live_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Globe className="h-4 w-4" />
          View Live
        </a>
      )}
      {project.github_url && (
        <a
          href={project.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80"
        >
          <Github className="h-4 w-4" />
          View Code
        </a>
      )}
      {project.figma_url && (
        <a
          href={project.figma_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80"
        >
          <Figma className="h-4 w-4" />
          View Design
        </a>
      )}
    </div>
  )
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) {
    return null
  }

  return (
    <Dialog open={!!project} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl p-0">
        <DialogTitle className="sr-only">{project.title}</DialogTitle>
        
        {/* Project Image */}
        <div className="relative aspect-video w-full">
          <Image
            src={project.images[0] ?? '/images/placeholder.jpg'}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Project Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="mb-2 text-2xl font-bold">{project.title}</h3>
            <p className="text-muted-foreground">{project.description}</p>
          </div>

          <TechStack techStack={project.tech_stack} />
          <ProjectLinks project={project} />
        </div>
      </DialogContent>
    </Dialog>
  )
} 