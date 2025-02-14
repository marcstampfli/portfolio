"use client";

import { motion } from "framer-motion";
import type { ExperienceResponse } from "@/types/experience";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { BackgroundGradient } from "@/components/background/background-gradient";
import { DownloadResumeButton } from "@/components/resume/download-resume-button";
import { TimelineItem } from "@/components/timeline/timeline-item";

const Icons = {
  Loader2: dynamic(() => import("lucide-react").then((mod) => mod.Loader2)),
  AlertCircle: dynamic(() => import("lucide-react").then((mod) => mod.AlertCircle)),
  Building2: dynamic(() => import("lucide-react").then((mod) => mod.Building2)),
};

export function ExperienceSection() {
  const {
    data: experiences = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/experiences");
        if (!response.ok) {
          throw new Error("Failed to fetch experiences");
        }
        const data = await response.json();
        return data as ExperienceResponse[];
      } catch (error) {
        console.error("Error fetching experiences:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const experiencesData = experiences || [];

  return (
    <section
      id="experience"
      className="relative py-24 sm:py-32"
      aria-label="Work Experience"
    >
      <BackgroundGradient />
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative text-center"
        >
          <div
            className="absolute -top-16 left-1/2 h-40 w-[380px] -translate-x-1/2 bg-primary/20 blur-[120px]"
            aria-hidden="true"
          />
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-primary via-primary/70 to-primary bg-[200%_auto] animate-text-shine bg-clip-text text-transparent">
              Experience Highlights
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Experienced in web development, design, and digital solutions for
            over a decade.
          </p>

          {!isLoading && !error && experiencesData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <DownloadResumeButton experiences={experiencesData} />
            </motion.div>
          )}
        </motion.div>

        <div className="relative mt-16">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading experiences...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-destructive">
              <Icons.AlertCircle className="h-8 w-8" />
              <p className="mt-4">Failed to load experiences. Please try again later.</p>
            </div>
          )}

          {!isLoading && !error && experiencesData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No experiences found.</p>
            </div>
          )}

          {!isLoading && !error && experiencesData.length > 0 && (
            <div className="relative max-w-7xl mx-auto">
              {experiencesData.map((experience, index) => (
                <TimelineItem
                  key={experience.id}
                  job={experience}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: experiencesData.map((exp, index) => ({
              "@type": "WorkExperience",
              position: index + 1,
              name: exp.position,
              description: exp.description,
              startDate: exp.period.split(" - ")[0],
              endDate: exp.period.split(" - ")[1] || "Present",
              skills: exp.tech_stack,
              accomplishments: exp.achievements,
              worksFor: {
                "@type": "Organization",
                name: exp.company,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
