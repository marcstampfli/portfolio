"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineItemProps {
  experience: {
    id: string;
    title: string;
    company: string;
    position: string | null;
    period: string;
    description: string;
    tech_stack: string[];
    achievements: string[];
    start_date: Date | string;
    end_date: Date | string | null;
    logo?: string | null;
    logo_background?: "none" | "light" | "dark";
    logo_fit?: "contain" | "cover";
    logo_width?: number | null;
    logo_height?: number | null;
    logo_padding?: number | null;
    location?: string | null;
    type?: string | null;
  };
  isLast?: boolean;
}

export function TimelineItem({ experience, isLast = false }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const prefersReducedMotion = useReducedMotion();
  const isCurrentRole = !experience.end_date;
  const logoBackgroundClass =
    experience.logo_background === "light"
      ? "border border-black/10 bg-white"
      : experience.logo_background === "none"
        ? "bg-transparent"
        : "bg-surface";
  const logoPadding = experience.logo_padding ?? 5;
  const logoWidth = experience.logo_width ?? 24;
  const logoHeight = experience.logo_height ?? 24;

  return (
    <div ref={ref} className="relative flex gap-3 sm:gap-5">
      {/* Timeline connector column */}
      <div className="relative flex flex-col items-center pt-1">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm border sm:h-12 sm:w-12",
            isCurrentRole
              ? "border-primary/20 bg-primary text-primary-foreground shadow-[0_0_18px_hsl(var(--primary)/0.16)]"
              : "border-borderStrong/80 bg-surfaceStrong text-muted-foreground"
          )}
        >
          {experience.logo ? (
            <div
              className={cn(
                "relative overflow-hidden rounded-sm",
                logoBackgroundClass,
                experience.logo_fit === "cover" ? "shadow-sm" : ""
              )}
              style={{
                width: `${logoWidth}px`,
                height: `${logoHeight}px`,
                padding: `${logoPadding}px`,
              }}
            >
              <Image
                src={experience.logo}
                alt={`${experience.company} logo`}
                fill
                sizes={`${logoWidth}px`}
                className={experience.logo_fit === "cover" ? "object-cover" : "object-contain"}
              />
            </div>
          ) : (
            <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
        </motion.div>

        {!isLast ? <div className="mt-3 w-px flex-1 bg-border/80" /> : null}
      </div>

      {/* Card */}
      <motion.article
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className={cn("surface-card relative flex-1 p-4 sm:p-6", !isLast && "mb-5 sm:mb-6")}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-border/70 pb-4 sm:pb-5">
          {/* Top row: title + current badge */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="font-display text-base font-semibold tracking-[-0.03em] text-foreground sm:text-xl">
                {experience.title}
              </h3>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">
                {experience.company}
              </p>
            </div>
            {isCurrentRole ? <Badge className="flex-shrink-0">Current Role</Badge> : null}
          </div>

          {/* Position */}
          {experience.position ? (
            <p className="text-xs text-foreground/80 sm:text-sm">{experience.position}</p>
          ) : null}

          {/* Meta row: date + type */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-sm border border-border/70 bg-secondary/50 px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:px-3 sm:py-1.5 sm:text-xs">
              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>{experience.period}</span>
            </div>
            {experience.type ? (
              <div className="inline-flex items-center rounded-sm border border-border/70 bg-secondary/50 px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:px-3 sm:py-1.5 sm:text-xs">
                {experience.type}
              </div>
            ) : null}
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm leading-6 text-muted-foreground sm:mt-5 sm:text-[0.96rem] sm:leading-7">
          {experience.description}
        </p>

        {/* Tech stack */}
        {experience.tech_stack.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
            {experience.tech_stack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        ) : null}

        {/* Achievements */}
        {experience.achievements.length > 0 ? (
          <div className="mt-4 border-t border-border/70 pt-4 sm:mt-5 sm:pt-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-xs">
              Key Achievements
            </p>
            <ul className="m-0 mt-2.5 list-none space-y-2 p-0 sm:space-y-2.5">
              {experience.achievements.map((achievement, index) => (
                <li
                  key={`${achievement}-${index}`}
                  className="flex items-start gap-1.5 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6"
                >
                  <ChevronRight className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary sm:h-3.5 sm:w-3.5" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </motion.article>
    </div>
  );
}
