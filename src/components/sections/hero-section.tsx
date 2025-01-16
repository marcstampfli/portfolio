"use client";

import { useRef, useMemo, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Code2, Palette, Compass, Sparkles } from "lucide-react";
import { FuturisticBackground } from "../background/futuristic-background";
import { TypeAnimation } from "react-type-animation";

export const HeroSection = memo(function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const fadeUpAnimation = useMemo(
    () => ({
      initial: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.1,
      },
    }),
    [prefersReducedMotion],
  );

  const highlights = useMemo(
    () => [
      {
        icon: Code2,
        label: "Problem Solver",
        description: "Turning ideas into reality",
      },
      {
        icon: Palette,
        label: "Creative Mind",
        description: "Design-driven approach",
      },
      {
        icon: Compass,
        label: "Tech Explorer",
        description: "Always learning, always growing",
      },
      {
        icon: Sparkles,
        label: "Innovator",
        description: "Future-focused vision",
      },
    ],
    [],
  );

  return (
    <>
      <section
        className="relative flex min-h-[90vh] items-center justify-center overflow-hidden"
        ref={containerRef}
        aria-label="Introduction"
        role="region"
      >
        {/* Background with particles */}
        <FuturisticBackground />

        <div className="container relative px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            {/* Main Content */}
            <motion.div {...fadeUpAnimation} className="space-y-8">
              {/* Title & Role */}
              <div>
                <div
                  className="absolute -top-16 left-1/2 h-40 w-[380px] -translate-x-1/2 bg-primary/20 blur-[120px]"
                  aria-hidden="true"
                ></div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                  <span className="block">Marc Stämpfli</span>
                  <div className="relative">
                    <span className="mt-2 block bg-gradient-to-r from-primary via-primary/70 to-primary bg-[200%_auto] animate-text-shine bg-clip-text text-2xl text-transparent sm:text-3xl">
                      <TypeAnimation
                        sequence={[
                          "Software Developer",
                          4000,
                          "Product Designer",
                          4000,
                          "Technical Lead",
                          4000,
                          "Digital Consultant",
                          4000,
                        ]}
                        wrapper="span"
                        speed={40}
                        repeat={Infinity}
                        cursor={true}
                        style={{ display: "inline-block" }}
                      />
                    </span>
                  </div>
                </h1>
              </div>

              {/* Brief Introduction */}
              <motion.p
                className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl"
                {...fadeUpAnimation}
                transition={{ delay: 0.1 }}
              >
                Hi, I&apos;m Marc. I believe in creating digital products that
                are both aesthetically pleasing and user-friendly.
              </motion.p>

              {/* Highlight Cards */}
              <motion.div
                className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
                initial={false}
                animate="animate"
                transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                {highlights.map((item, index) => (
                  <motion.div
                    key={item.label}
                    {...fadeUpAnimation}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-primary/10"
                  >
                    <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2.5 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/30">
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-medium text-foreground">
                      {item.label}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    {/* Decorative corner elements */}
                    <div className="absolute -right-px -top-px h-8 w-8 rounded-bl-xl border-b border-l border-primary/20 transition-colors group-hover:border-primary/30" />
                    <div className="absolute -bottom-px -left-px h-8 w-8 rounded-tr-xl border-t border-r border-primary/20 transition-colors group-hover:border-primary/30" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Marc Stämpfli",
            jobTitle: "Full Stack Developer",
            description:
              "Full Stack Developer and UI Designer specializing in modern web applications, WordPress development, and user-centered design solutions.",
            url: "https://marcstampfli.com",
            sameAs: [
              "https://github.com/yourusername",
              "https://linkedin.com/in/yourusername",
              "https://twitter.com/yourusername",
            ],
            knowsAbout: [
              "Web Development",
              "UI Design",
              "React",
              "Next.js",
              "WordPress",
              "TypeScript",
              "JavaScript",
            ],
          }),
        }}
      />
    </>
  );
});
