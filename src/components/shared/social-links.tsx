"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Instagram } from "lucide-react";

export function SocialLinks() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="mt-12 flex items-center justify-center gap-6"
    >
      {[
        {
          icon: Github,
          href: "https://github.com/marcstampfli",
          label: "GitHub",
        },
        {
          icon: Linkedin,
          href: "https://www.linkedin.com/in/marc-stämpfli",
          label: "LinkedIn",
        },
        {
          icon: Instagram,
          href: "https://instagram.com/marcstampfli",
          label: "Instagram",
        },
      ].map(({ icon: Icon, href, label }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative rounded-full bg-primary/5 p-3 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
        >
          <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="sr-only">{label}</span>
          <div className="animate-pulse-slow absolute inset-0 -z-10 rounded-full border border-primary/20" />
          <div className="absolute inset-0 -z-10 rounded-full opacity-0 blur-sm transition-opacity group-hover:bg-primary/20 group-hover:opacity-100" />
        </Link>
      ))}
    </motion.div>
  );
}
