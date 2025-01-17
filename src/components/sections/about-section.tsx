"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Lightbulb, Heart, Target, Compass } from "lucide-react";
import Image from "next/image";

const journey = [
  {
    icon: Lightbulb,
    title: "The Spark",
    description:
      "Started coding out of curiosity, quickly fell in love with creating digital experiences that make a difference.",
  },
  {
    icon: Heart,
    title: "The Passion",
    description:
      "Found my calling in bridging design and technology, creating solutions that feel both beautiful and intuitive.",
  },
  {
    icon: Target,
    title: "The Mission",
    description:
      "Dedicated to crafting digital products that solve real problems and bring value to people's lives.",
  },
  {
    icon: Compass,
    title: "The Journey",
    description:
      "Constantly exploring new technologies and approaches, always aiming to push the boundaries of what's possible.",
  },
];

export function AboutSection() {
  const prefersReducedMotion = useReducedMotion();

  const fadeIn = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <>
      <section
        className="relative overflow-hidden py-24 sm:py-32"
        id="about"
        aria-label="About Me"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="absolute -top-16 left-1/2 h-40 w-[380px] -translate-x-1/2 bg-primary/20 blur-[120px]"
            aria-hidden="true"
          ></div>
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <motion.div {...fadeIn} className="text-center mb-16">
              <div className="flex items-center justify-center mb-8">
                {/* Profile Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div
                    className="relative h-32 w-32 overflow-hidden rounded-2xl border border-primary/20 bg-primary/5"
                    style={{
                      position: "relative",
                      height: "128px",
                      width: "128px",
                      display: "inline-block",
                      contain: "layout",
                      transform: "translate3d(0, 0, 0)",
                    }}
                  >
                    <Image
                      src="/profile.jpg"
                      alt="Marc Stämpfli"
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      sizes="(max-width: 768px) 128px, 128px"
                      priority
                    />
                  </div>
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/50 to-primary/30 opacity-0 blur transition duration-500 group-hover:opacity-100" />
                </motion.div>
              </div>

              <h2 className="text-4xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-primary via-primary/70 to-primary bg-[200%_auto] animate-text-shine bg-clip-text text-transparent">
                  My Journey
                </span>
              </h2>

              <motion.p
                className="text-lg text-muted-foreground"
                {...fadeIn}
                transition={{ delay: 0.1 }}
              >
                Driven by curiosity, creativity, and a relentless pursuit of
                excellence, I believe in the power of technology to transform
                ideas into reality.
              </motion.p>
            </motion.div>

            {/* Journey Cards */}
            <motion.div
              className="grid gap-6 sm:grid-cols-2"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {journey.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-primary/10"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/30">
                    <item.icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <h3 className="mb-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>

                  {/* Decorative corner elements */}
                  <div className="absolute -right-px -top-px h-8 w-8 rounded-bl-xl border-b border-l border-primary/20 transition-colors group-hover:border-primary/30" />
                  <div className="absolute -bottom-px -left-px h-8 w-8 rounded-tr-xl border-t border-r border-primary/20 transition-colors group-hover:border-primary/30" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
