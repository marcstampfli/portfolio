"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { type Project } from "@/types/prisma";
import {
  Github,
  Globe,
  Figma,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { PlaceholderImage } from "./placeholder-image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProjectTag } from "./project-tag";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

interface TechStackProps {
  techStack: string[];
}

interface ProjectLinksProps {
  project: Project;
}

interface ImageGalleryProps {
  images: (string | StaticImageData)[];
  title: string;
}

function TechStack({ techStack }: TechStackProps) {
  if (!techStack?.length) return null;

  return (
    <div className="mb-4 sm:mb-6">
      <h4 className="mb-2 sm:mb-3 text-sm font-medium text-muted-foreground">
        Tech Stack
      </h4>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-primary/10 px-2.5 py-1 text-xs sm:text-sm font-medium text-primary ring-1 ring-primary/20"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectLinks({ project }: ProjectLinksProps) {
  if (!project.live_url && !project.github_url && !project.figma_url)
    return null;

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {project.live_url && (
        <a
          href={project.live_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-primary px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          View Live
        </a>
      )}
      {project.github_url && (
        <a
          href={project.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#24292F] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          View Code
        </a>
      )}
      {project.figma_url && (
        <a
          href={project.figma_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#1E1E1E] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Figma className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          View Design
        </a>
      )}
    </div>
  );
}

function getImageSrc(image: string | StaticImageData): string {
  if (typeof image === "string") return image;
  return image.src;
}

function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);

  if (!images?.length) return null;

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/50">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="relative h-full w-full"
        >
          {images[currentImage] ? (
            <Image
              src={getImageSrc(images[currentImage])}
              alt={`${title} - Image ${currentImage + 1}`}
              fill
              className="object-contain"
              priority={currentImage === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1100px"
              quality={90}
            />
          ) : (
            <PlaceholderImage
              size="lg"
              text={title}
              className="w-full h-full"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous image</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={nextImage}
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next image</span>
          </Button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === currentImage
                    ? "w-3 bg-primary"
                    : "w-1.5 bg-primary/50 hover:bg-primary/75",
                )}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === currentImage}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  const formattedDate = format(new Date(project.created_at), "MMMM yyyy");

  return (
    <Dialog open={!!project} onOpenChange={() => onClose()}>
      <DialogContent className="max-h-[calc(100vh-2rem)] w-full max-w-[calc(100vw-2rem)] sm:max-w-[90vw] lg:max-w-[1100px] p-0 gap-0 overflow-y-auto">
        <div className="relative flex flex-col">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-50 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close modal</span>
          </Button>

          <ImageGallery
            images={project.images as (string | StaticImageData)[]}
            title={project.title}
          />

          <div className="flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                  {project.title}
                </DialogTitle>
                <time
                  dateTime={project.created_at}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground"
                >
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {formattedDate}
                </time>
              </div>
              <DialogDescription className="text-sm sm:text-base text-muted-foreground">
                {project.description}
              </DialogDescription>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.tags.map((tag) => (
                <ProjectTag key={tag} className="text-xs sm:text-sm">
                  {tag}
                </ProjectTag>
              ))}
            </div>

            <TechStack techStack={project.tech_stack} />

            {project.content && (
              <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
                {project.content}
              </div>
            )}

            {project.client && (
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                  Client
                </h4>
                <p className="text-sm sm:text-base">{project.client}</p>
              </div>
            )}

            <ProjectLinks project={project} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
