"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  MapPin,
  Briefcase,
  Award,
  ArrowRight,
} from "lucide-react";
import PlaceholderImage from "../shared/placeholder-image";
import { type Experience } from "@/types/experience";

interface TimelineItemProps {
  job: Experience;
  index: number;
}

export function TimelineItem({ job, index }: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-8 mb-16 last:mb-0 group"
    >
      {/* Timeline dot with ripple effect */}
      <div className="absolute left-0 top-0 -translate-x-1/2">
        <div className="relative w-4 h-4">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-slow" />
          <div className="absolute inset-0 rounded-full bg-primary ring-4 ring-background" />
        </div>
      </div>

      {/* Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-6 backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-primary/10">
        {/* Header */}
        <div className="flex flex-wrap gap-6 items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary mb-2">
              {job.position}
            </h3>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {job.company}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {job.company}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {job.period}
              </div>
            </div>
          </div>

          {/* Company Logo */}
          <PlaceholderImage
            text={job.company}
            size="md"
            className="group-hover:border-primary/20"
          />
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-4">{job.description}</p>

        {/* Achievements */}
        <div className="mb-4">
          <h4 className="font-medium mb-2 text-foreground flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Key Achievements
          </h4>
          <ul className="space-y-2">
            {job.achievements.map((achievement, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
                className="flex items-start gap-2 text-muted-foreground"
              >
                <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                {achievement}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {job.tech_stack.map((tech: string, i: number) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + i * 0.05 }}
              className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary"
            >
              {tech}
            </motion.span>
          ))}
        </div>

        {/* Decorative corner elements */}
        <div className="absolute -right-px -top-px h-8 w-8 rounded-bl-xl border-b border-l border-primary/20" />
        <div className="absolute -bottom-px -left-px h-8 w-8 rounded-tr-xl border-t border-r border-primary/20" />
      </div>
    </motion.div>
  );
}
