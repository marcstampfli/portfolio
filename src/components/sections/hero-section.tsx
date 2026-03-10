"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FuturisticBackground } from "@/components/background/futuristic-background";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

const heroMeta = [
  {
    label: "Base",
    value: siteConfig.location,
  },
  {
    label: "Focus",
    value: "WordPress, React, UI design",
  },
  {
    label: "Contact",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}?subject=New project — [brief description]&body=Hi Marc, I have a project I'd like to discuss...`,
  },
];

export const HeroSection = memo(function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <section
        className="relative flex min-h-screen items-center overflow-hidden pb-24 pt-28 sm:pb-28 sm:pt-36"
        aria-label="Introduction"
      >
        <div className="absolute inset-0 z-0">
          <FuturisticBackground />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl"
          >
            <div className="section-kicker mb-8">
              <span className="eyebrow-dot" aria-hidden="true" />
              <span>WordPress • React • UI Design</span>
            </div>

            <h1 className="text-balance font-display text-6xl font-semibold tracking-[-0.08em] text-foreground sm:text-7xl lg:text-[6.4rem] lg:leading-[0.95]">
              Web Developer &amp; Designer
            </h1>

            <p className="text-foreground/92 mt-6 max-w-3xl text-balance font-display text-2xl font-medium tracking-[-0.04em] sm:text-3xl lg:text-4xl">
              Building websites, WordPress solutions, and web apps for 15+ years.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#projects">
                  View Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#contact">Start a Conversation</a>
              </Button>
            </div>

            <div className="mt-20 grid gap-6 border-t border-border/60 pt-6 sm:grid-cols-3 sm:gap-8">
              {heroMeta.map((item) => (
                <div key={item.label} className="space-y-2">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="link block max-w-sm text-sm leading-6 sm:text-base"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="max-w-sm text-sm leading-6 text-foreground sm:text-base">
                      {item.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Marc Stämpfli",
            jobTitle: "Web Developer & Designer",
            description:
              "Web Developer and Designer based in Trinidad and Tobago with 15+ years of experience building WordPress sites, React apps, and UI-driven web products.",
            url: siteConfig.url,
            sameAs: siteConfig.sameAs,
            knowsAbout: [
              "WordPress",
              "React",
              "Next.js",
              "UI Design",
              "Gutenberg",
              "Elementor",
              "Web Development",
              "JavaScript",
              "TypeScript",
              "PHP",
            ],
          }),
        }}
      />
    </>
  );
});
