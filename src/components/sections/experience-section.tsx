"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import { TimelineItem } from "@/components/timeline/timeline-item-vertical";
import { BackgroundEffect } from "@/components/timeline/background-effect";
import { SectionHeader } from "@/components/shared/section-header";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { generatePeriodString } from "@/lib/date-utils";
import { type Experience } from "@/types";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [showFullTimeline, setShowFullTimeline] = useState(false);

  const sortedExperiences = useMemo(
    () =>
      [...experiences].sort((a, b) => {
        const dateA = new Date(a.start_date).getTime();
        const dateB = new Date(b.start_date).getTime();
        return dateB - dateA;
      }),
    [experiences]
  );

  const recentExperiences = sortedExperiences.slice(0, 3);
  const archivedExperiences = sortedExperiences.slice(3);
  const visibleExperiences = showFullTimeline ? sortedExperiences : recentExperiences;

  return (
    <section
      id="experience"
      className="section-shell relative"
      aria-labelledby="experience-heading"
    >
      <BackgroundEffect />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <SectionHeader
            titleId="experience-heading"
            eyebrow="Experience"
            title="15+ years building for the web."
            subtitle="From in-house roles to freelance work and agency life — a career spent shipping websites and products."
            titleClassName="text-3xl sm:text-4xl lg:text-5xl"
          />
        </motion.div>

        {sortedExperiences.length === 0 ? (
          <div className="surface-panel max-w-3xl p-8 sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
              Experience coming soon.
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              No experience entries are published yet.
            </p>
          </div>
        ) : (
          <div className="relative mx-auto max-w-5xl space-y-6">
            <div className="space-y-1">
              {visibleExperiences.map((experience, index) => (
                <TimelineItem
                  key={experience.id}
                  experience={{
                    ...experience,
                    period: generatePeriodString(experience.start_date, experience.end_date),
                  }}
                  isLast={index === visibleExperiences.length - 1}
                />
              ))}
            </div>

            {archivedExperiences.length > 0 ? (
              <div className="flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {showFullTimeline
                    ? `Showing all ${sortedExperiences.length} experience entries.`
                    : `Showing ${recentExperiences.length} recent roles. ${archivedExperiences.length} older roles are tucked away.`}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowFullTimeline((current) => !current)}
                >
                  {showFullTimeline ? "Hide Older Roles" : "View Full Timeline"}
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </Container>
    </section>
  );
}
