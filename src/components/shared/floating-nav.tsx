"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Container } from "@/components/ui/container";

export function FloatingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateState = () => {
      setIsScrolled(window.scrollY > 18);

      const current = navItems
        .map(({ href }) => {
          const element = document.querySelector(href);

          if (!element) {
            return null;
          }

          const rect = element.getBoundingClientRect();
          const offset = Math.abs(rect.top - 120);

          return { href, offset };
        })
        .filter((entry): entry is { href: string; offset: number } => Boolean(entry))
        .sort((a, b) => a.offset - b.offset)[0];

      if (current) {
        setActiveSection(current.href);
      }
    };

    updateState();
    window.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);

    return () => {
      window.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, []);

  const handleNavClick = (href: string) => {
    const target = document.querySelector(href);
    if (!target) return;
    setMobileMenuOpen(false);
    // Wait for menu close animation (250ms) before scrolling so layout is stable
    setTimeout(() => {
      const navHeight = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }, 260);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 pt-4 sm:pt-5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={cn("surface-panel transition-theme relative", isScrolled ? "shadow-card" : "")}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
            <button
              type="button"
              onClick={() => handleNavClick("#home")}
              className="group flex items-center gap-3 bg-transparent text-left"
              aria-label="Scroll to home"
            >
              <span className="transition-theme flex h-7 w-7 items-center justify-center rounded-sm bg-primary font-display text-[0.62rem] font-bold tracking-[0.1em] text-primary-foreground group-hover:bg-primary/90">
                MS
              </span>
              <span
                className="transition-theme h-4 w-px bg-border/70 group-hover:bg-primary/30"
                aria-hidden="true"
              />
              <span className="transition-theme text-foreground/92 font-display text-sm font-medium tracking-[0.08em] group-hover:text-foreground">
                Marc Stämpfli
              </span>
            </button>

            <nav
              className="hidden items-center gap-1 md:flex"
              role="navigation"
              aria-label="Primary"
            >
              {navItems.map(({ href, label }) => {
                const isActive = href === activeSection;

                return (
                  <a
                    key={href}
                    href={href}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavClick(href);
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "transition-theme relative rounded-sm px-3 py-2 text-sm text-muted-foreground no-underline hover:text-foreground",
                      isActive && "text-foreground"
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-sm border border-primary/10 bg-primary/10"
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      />
                    ) : null}
                    <span className="relative">{label}</span>
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="transition-theme inline-flex h-11 w-11 items-center justify-center rounded-sm border-0 bg-transparent text-muted-foreground hover:text-primary md:hidden"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav"
                aria-label="Toggle navigation"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                  className="overflow-visible"
                >
                  {/* Top line → top-right diagonal */}
                  <motion.line
                    x1="1"
                    y1="4"
                    x2="17"
                    y2="4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                    animate={
                      mobileMenuOpen
                        ? { x1: 2, y1: 2, x2: 16, y2: 16 }
                        : { x1: 1, y1: 4, x2: 17, y2: 4 }
                    }
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {/* Middle line → shrinks to a dot */}
                  <motion.line
                    x1="1"
                    y1="9"
                    x2="17"
                    y2="9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                    animate={
                      mobileMenuOpen
                        ? { x1: 9, y1: 9, x2: 9, y2: 9, opacity: 0 }
                        : { x1: 1, y1: 9, x2: 17, y2: 9, opacity: 1 }
                    }
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {/* Bottom line → bottom-left diagonal */}
                  <motion.line
                    x1="1"
                    y1="14"
                    x2="17"
                    y2="14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                    animate={
                      mobileMenuOpen
                        ? { x1: 2, y1: 16, x2: 16, y2: 2 }
                        : { x1: 1, y1: 14, x2: 17, y2: 14 }
                    }
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {mobileMenuOpen ? (
              <motion.div
                id="mobile-nav"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-t border-border/60 md:hidden"
              >
                <nav className="grid gap-1 p-3" aria-label="Mobile">
                  {navItems.map(({ href, label, icon: Icon }, index) => {
                    const isActive = href === activeSection;

                    return (
                      <motion.a
                        key={href}
                        href={href}
                        onClick={(event) => {
                          event.preventDefault();
                          handleNavClick(href);
                        }}
                        aria-current={isActive ? "page" : undefined}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{
                          duration: 0.2,
                          delay: index * 0.04,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={cn(
                          "transition-theme flex items-center gap-3 rounded-sm border px-4 py-3 text-sm",
                          isActive
                            ? "border-primary/20 bg-primary/10 text-foreground"
                            : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-secondary/50 hover:text-foreground"
                        )}
                      >
                        <span className={cn("transition-theme", isActive ? "text-primary" : "")}>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span>{label}</span>
                        {isActive ? (
                          <motion.span
                            layoutId="mobile-nav-active"
                            className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                            transition={{ type: "spring", stiffness: 300, damping: 28 }}
                          />
                        ) : null}
                      </motion.a>
                    );
                  })}
                </nav>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </Container>
    </div>
  );
}
