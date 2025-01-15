"use client";

import { motion, useAnimation } from "framer-motion";
import { getExperiences } from "@/app/actions";
import { type Experience } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import type { PanInfo } from "framer-motion";
import { BackgroundGradient } from "../background/background-gradient";

export function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const {
    data: experiences = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["experiences"],
    queryFn: getExperiences,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const maxIndex = Math.max(0, Math.ceil(experiences.length / 3) - 1);

  const navigate = useCallback(
    async (direction: "prev" | "next") => {
      if (
        (direction === "prev" && activeIndex === 0) ||
        (direction === "next" && activeIndex === maxIndex)
      ) {
        return;
      }

      await controls.start({
        x: direction === "prev" ? "100%" : "-100%",
        transition: { duration: 0.2, ease: "easeInOut" },
      });

      setActiveIndex((prev) => (direction === "prev" ? prev - 1 : prev + 1));

      controls.start({
        x: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      });
    },
    [activeIndex, maxIndex, controls],
  );

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = 50; // minimum distance for swipe
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && activeIndex > 0) {
        navigate("prev");
      } else if (info.offset.x < 0 && activeIndex < maxIndex) {
        navigate("next");
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        navigate("prev");
      } else if (e.key === "ArrowRight") {
        navigate("next");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [maxIndex, navigate]);

  return (
    <>
      <section
        id="experience"
        className="relative py-24 sm:py-32"
        aria-label="Work Experience"
      >
        <BackgroundGradient />

        <div className="container relative px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative text-center"
          >
            <div
              className="absolute -top-16 left-1/2 h-40 w-[380px] -translate-x-1/2 bg-primary/20 blur-[120px]"
              aria-hidden="true"
            ></div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-primary via-primary/70 to-primary bg-[200%_auto] animate-text-shine bg-clip-text text-transparent">
                Experience Highlights
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Experienced in web development, design, and digital solutions for
              over a decade.
            </p>
          </motion.div>

          <div className="relative mt-16">
            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">
                  Loading experiences...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex flex-col items-center justify-center py-12 text-destructive">
                <AlertCircle className="h-8 w-8" />
                <p className="mt-4">
                  Failed to load experiences. Please try again later.
                </p>
              </div>
            )}

            {/* Success State */}
            {!isLoading && !error && experiences.length > 0 && (
              <div className="relative max-w-7xl mx-auto">
                {/* Navigation */}
                <div className="hidden md:block">
                  <div className="absolute -left-16 top-1/2 -translate-y-1/2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate("prev")}
                      disabled={activeIndex === 0}
                      className={cn(
                        "h-12 w-12 rounded-full transition-all",
                        activeIndex === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-primary/10",
                      )}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="absolute -right-16 top-1/2 -translate-y-1/2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate("next")}
                      disabled={activeIndex === maxIndex}
                      className={cn(
                        "h-12 w-12 rounded-full transition-all",
                        activeIndex === maxIndex
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-primary/10",
                      )}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex md:hidden justify-between mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("prev")}
                    disabled={activeIndex === 0}
                    className={cn(
                      "h-10 w-10 rounded-full transition-all",
                      activeIndex === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-primary/10",
                    )}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("next")}
                    disabled={activeIndex === maxIndex}
                    className={cn(
                      "h-10 w-10 rounded-full transition-all",
                      activeIndex === maxIndex
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-primary/10",
                    )}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* Experience Cards */}
                <div
                  className="overflow-hidden touch-pan-y"
                  ref={constraintsRef}
                >
                  <motion.div
                    drag="x"
                    dragConstraints={constraintsRef}
                    dragElastic={0.1}
                    onDragEnd={handleDragEnd}
                    animate={controls}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    {experiences
                      .slice(activeIndex * 3, activeIndex * 3 + 3)
                      .map((exp, index) => (
                        <motion.div
                          key={exp.id}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                            ease: "easeOut",
                          }}
                          className="min-h-[400px]"
                        >
                          <div className="h-full rounded-2xl border border-primary/10 bg-primary/5 p-6 sm:p-8 flex flex-col transition-all duration-200 hover:border-primary/30 relative">
                            {/* Decorative corner elements */}
                            <div className="absolute -right-px -top-px h-8 w-8 rounded-bl-xl border-b border-l border-primary/20 transition-colors group-hover:border-primary/30" />
                            <div className="absolute -bottom-px -left-px h-8 w-8 rounded-tr-xl border-t border-r border-primary/20 transition-colors group-hover:border-primary/30" />
                            {/* Logo */}
                            <div className="mb-6 flex justify-center">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                              </div>
                            </div>

                            {/* Period */}
                            <div className="text-center mb-4">
                              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 sm:px-4 sm:py-1.5 text-sm font-medium text-primary">
                                {exp.period}
                              </span>
                            </div>

                            {/* Title & Company */}
                            <div className="text-center mb-4">
                              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">
                                {exp.title}
                              </h3>
                              <p className="text-sm sm:text-base text-primary">
                                {exp.company}
                              </p>
                            </div>

                            {/* Description */}
                            <p className="text-muted-foreground text-center mb-6 text-xs sm:text-sm flex-grow line-clamp-4">
                              {exp.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                  </motion.div>
                </div>

                {/* Progress Bars */}
                <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-2">
                  {Array.from({
                    length: Math.ceil(experiences.length / 3),
                  }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "w-8 sm:w-12 h-1 rounded-sm transition-all duration-300",
                        index === activeIndex
                          ? "bg-primary"
                          : "bg-primary/20 hover:bg-primary/40",
                      )}
                      aria-label={`Go to experience page ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && experiences.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">No experiences found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: experiences.map(
              (exp: Experience, index: number) => ({
                "@type": "WorkExperience",
                position: index + 1,
                name: exp.title,
                description: exp.description,
                startDate: exp.period.split(" - ")[0],
                endDate: exp.period.split(" - ")[1] || "Present",
                skills: exp.tech_stack,
                accomplishments: exp.achievements,
                worksFor: {
                  "@type": "Organization",
                  name: exp.company,
                },
              }),
            ),
          }),
        }}
      />
    </>
  );
}
