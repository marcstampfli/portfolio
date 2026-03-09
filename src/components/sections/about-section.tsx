"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Blocks, PenTool, Workflow } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/shared/section-header";

const principles = [
  {
    icon: Workflow,
    title: "Full ownership, start to finish",
    description:
      "I handle design, development, and deployment — so nothing gets lost between phases and the end result matches what was planned.",
  },
  {
    icon: PenTool,
    title: "Design that earns its place",
    description:
      "I care about hierarchy, spacing, and clarity. Interfaces should feel considered, not just functional.",
  },
  {
    icon: Blocks,
    title: "WordPress done properly",
    description:
      "Custom themes, Gutenberg blocks, plugins, Kadence, Elementor, performance — whatever the project calls for, built to last.",
  },
];

const focusAreas = [
  "WordPress development",
  "UI / UX design",
  "React & Next.js",
  "Custom themes & plugins",
];

export function AboutSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="about" className="section-shell relative" aria-labelledby="about-heading">
      <Container>
        <div className="space-y-12">
          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeader
              titleId="about-heading"
              eyebrow="About"
              title="Developer and designer with range."
              subtitle="I've been building for the web since 2008 — in-house, freelance, and now agency work. WordPress is my core, React and Next.js are where I'm spending more time."
              titleClassName="text-3xl sm:text-4xl lg:text-5xl"
              className="max-w-3xl"
            />
          </motion.div>

          {/* Bio row — photo + text */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-6 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-start lg:grid-cols-[200px_minmax(0,1fr)]"
          >
            {/* Photo */}
            <div className="surface-card overflow-hidden p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border/60 bg-secondary/40">
                <Image
                  src="/profile.jpg"
                  alt="Marc Stämpfli portrait"
                  fill
                  priority
                  sizes="(max-width: 640px) 160px, 200px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Bio + tags */}
            <div className="surface-panel flex flex-col justify-between gap-6 p-6 sm:p-8">
              <div className="space-y-4">
                <p className="text-foreground/88 text-base leading-8">
                  My work sits across development and design — which means I think about how
                  something looks, how it works, and how it's built, all at once.
                </p>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                  Most of my time goes into WordPress: custom themes, block development, plugin
                  work, performance, and keeping things maintainable. Outside of that, I build with
                  React and Next.js, and I'm currently working on a few personal projects — games,
                  apps, and tools built for fun and for Trinidad.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-border/60 pt-5">
                {focusAreas.map((item) => (
                  <span
                    key={item}
                    className="rounded-sm border border-border/70 bg-secondary/50 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Principles — 3 col grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            {principles.map((item, index) => (
              <motion.article
                key={item.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{
                  duration: 0.45,
                  delay: 0.08 + index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="surface-panel flex flex-col gap-4 p-6"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-primary/20 bg-primary/10 text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-display text-base font-semibold tracking-[-0.02em] text-foreground">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
