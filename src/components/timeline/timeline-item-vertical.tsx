"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineItemProps {
  experience: {
    id: string;
    title: string;
    company: string;
    position: string;
    period: string;
    description: string;
    tech_stack: string[];
    achievements: string[];
    start_date: Date | string;
    end_date: Date | string | null;
    logo?: string | null;
    location?: string | null;
  };
  index: number;
  isLast?: boolean;
}

export function TimelineItem({ experience, isLast = false }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  
  const isCurrentJob = !experience.end_date;

  return (
    <div 
      ref={ref}
      className="relative flex gap-6 md:gap-8"
    >
      {/* Timeline line and dot */}
      <div className="relative flex flex-col items-center">
        {/* The dot/node */}
        <motion.div
          initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={cn(
            "relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-4 transition-all duration-300",
            isCurrentJob 
              ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
              : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-primary"
          )}
        >
          {experience.logo ? (
            <div className="relative h-6 w-6 overflow-hidden rounded-full">
              <Image
                src={experience.logo}
                alt={`${experience.company} logo`}
                fill
                className="object-contain"
                sizes="24px"
              />
            </div>
          ) : (
            <Briefcase className="h-5 w-5" />
          )}
          
          {/* Pulse effect for current job */}
          {isCurrentJob && (
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          )}
        </motion.div>

        {/* Connector line */}
        {!isLast && (
          <div className="w-px flex-1 bg-border" />
        )}
      </div>

      {/* Content */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        className={cn(
          "group relative flex-1 pb-12",
          isLast && "pb-0"
        )}
      >
        <div className={cn(
          "relative rounded-xl border bg-card p-5 md:p-6 shadow-sm transition-all duration-300",
          "hover:shadow-md hover:border-primary/20",
        )}>
          {/* Current job badge */}
          {isCurrentJob && (
            <Badge className="absolute -top-2.5 right-4 z-20 bg-primary text-primary-foreground text-xs">
              Current Role
            </Badge>
          )}

          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-bold text-foreground">
                {experience.title}
              </h3>
              <p className="text-base text-foreground/80 font-medium">
                {experience.company}
                <span className="text-muted-foreground font-normal"> • {experience.position}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>{experience.period}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-4">
            {experience.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {experience.tech_stack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs"
              >
                {tech}
              </Badge>
            ))}
          </div>

          {/* Achievements */}
          {experience.achievements.length > 0 && (
            <div className="border-t border-border/50 pt-4">
              <p className="text-sm font-semibold text-foreground mb-2">Key Achievements</p>
              <ul className="space-y-1.5">
                {experience.achievements.map((achievement, i) => (
                  <li 
                    key={i} 
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Top accent line */}
          <div className={cn(
            "absolute left-0 top-0 h-1 rounded-tl-xl transition-all duration-300",
            isCurrentJob 
              ? "w-full bg-gradient-to-r from-primary to-primary/50 rounded-tr-xl" 
              : "w-16 bg-primary/30 group-hover:w-32 group-hover:bg-primary/50"
          )} />
        </div>
      </motion.div>
    </div>
  );
}
