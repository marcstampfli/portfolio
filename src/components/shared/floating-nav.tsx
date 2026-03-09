"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
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
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
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
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden border-t border-border/80 md:hidden"
              >
                <nav className="grid gap-1 p-3" aria-label="Mobile">
                  {navItems.map(({ href, label, icon: Icon }) => {
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
                          "transition-theme flex items-center gap-3 rounded-sm border px-3 py-3 text-sm",
                          isActive
                            ? "border-primary/20 bg-primary/10 text-foreground"
                            : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-secondary/50 hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span>{label}</span>
                      </a>
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
