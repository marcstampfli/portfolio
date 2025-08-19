"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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
    start_date: string;
    end_date: string | null;
  };
  index: number;
}

export function TimelineItem({ experience, index }: TimelineItemProps) {
  return (
    <motion.div
      className="group relative h-full rounded-xl border bg-card p-6 shadow-sm transition-colors hover:bg-accent/5"
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4">
          <p className="font-medium text-muted-foreground">{experience.period}</p>
        </div>

        <h3 className="text-xl font-semibold">{experience.title}</h3>
        <p className="mt-1 font-medium text-muted-foreground">
          {experience.company} • {experience.position}
        </p>

        <p className="mt-4 text-muted-foreground">
          {experience.description}
        </p>

        <div className="mt-auto">
          <div className="mt-4 flex flex-wrap gap-2">
            {experience.tech_stack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="transition-colors dark:bg-muted/30 dark:text-foreground/80"
              >
                {tech}
              </Badge>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <p className="font-medium">Key Achievements:</p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              {experience.achievements.map((achievement, i) => (
                <li key={i}>{achievement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div 
        className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div 
        className="absolute left-0 top-0 h-1 w-full rounded-t-xl bg-gradient-to-r from-primary/40 to-primary/5"
      />
    </motion.div>
  );
}
