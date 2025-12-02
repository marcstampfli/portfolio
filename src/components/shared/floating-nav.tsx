"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav";
import { Menu, X } from "lucide-react";

interface ScrollSection {
  id: string;
  top: number;
}

export function FloatingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("#home");
  const [isScrolled, setIsScrolled] = useState(false);

  // Navigate to section by index
  const navigateToSection = useCallback((direction: 'next' | 'prev') => {
    const currentIndex = navItems.findIndex(item => item.href === activeSection);
    let newIndex = currentIndex;
    
    if (direction === 'next' && currentIndex < navItems.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }
    
    if (newIndex !== currentIndex) {
      const targetHref = navItems[newIndex].href;
      document.querySelector(targetHref)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSection]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        navigateToSection('next');
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        navigateToSection('prev');
      } else if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateToSection, mobileMenuOpen]);

  // Update active section and scroll state
  useEffect(() => {
    const updateState = () => {
      // Update scroll state
      setIsScrolled(window.scrollY > 100);

      // Update active section
      const sections = navItems.map(({ href }) => {
        const element = document.querySelector(href);
        if (!element) return { id: href, top: 0 };
        const rect = element.getBoundingClientRect();
        return {
          id: href,
          top: rect.top + window.scrollY,
        };
      });

      const currentSection = sections.reduce(
        (closest: ScrollSection, section: ScrollSection) => {
          if (
            Math.abs(section.top - window.scrollY) <
            Math.abs(closest.top - window.scrollY)
          ) {
            return section;
          }
          return closest;
        },
      );

      setActiveSection(currentSection.id);
    };

    window.addEventListener("scroll", updateState);
    return () => window.removeEventListener("scroll", updateState);
  }, []);

  const handleNavClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({
      behavior: "smooth",
    });
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-4"
      >
        <nav
          className="hidden md:flex items-center space-x-1 rounded-full border border-primary/10 bg-background/40 px-4 py-2 shadow-lg backdrop-blur-md transition-all duration-300"
          role="navigation"
          aria-label="Main navigation"
        >
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = activeSection === href;
            return (
              <a
                key={href}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(href);
                }}
                className={cn(
                  "group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary",
                  isActive && "text-primary",
                  isScrolled && !isActive && "px-2",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="bubble"
                    className="absolute inset-0 z-0 rounded-full bg-primary/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span
                    className={cn(
                      "relative transition-all duration-300",
                      isScrolled &&
                        !isActive &&
                        "w-0 overflow-hidden opacity-0 p-0",
                    )}
                  >
                    {label}
                  </span>
                </span>
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden fixed top-3 right-3 h-10 w-10 flex items-center justify-center rounded-full bg-background/40 border border-primary/10 backdrop-blur-md"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-primary" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5 text-primary" aria-hidden="true" />
          )}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          y: mobileMenuOpen ? 0 : -32,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          "fixed inset-x-0 top-0 z-40 bg-background/80 backdrop-blur-md border-b border-primary/10 py-16 shadow-lg",
          !mobileMenuOpen && "pointer-events-none",
        )}
      >
        <nav
          className="container px-4"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = activeSection === href;
              return (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(href);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-base text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary",
                      isActive && "bg-primary/10 text-primary",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </motion.div>
    </>
  );
}
