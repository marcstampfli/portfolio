"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/nav";
import { cn, getScrollBehavior } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Container } from "@/components/ui/container";

export function FloatingNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pendingScrollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let frame: number | null = null;

    const onScroll = () => {
      if (frame !== null) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = null;
        setIsScrolled(window.scrollY > 18);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    const sections = navItems
      .map(({ href }) => document.querySelector<HTMLElement>(href))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveSection("#" + visible.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    let frame: number | null = null;
    let attempts = 0;

    const scrollToHashTarget = () => {
      const requestedHash = window.location.hash;
      const targetId = requestedHash.slice(1);
      const target = targetId ? document.getElementById(targetId) : null;

      if (!targetId) {
        return;
      }

      if (!target && attempts < 60) {
        attempts += 1;
        frame = window.requestAnimationFrame(scrollToHashTarget);
        return;
      }

      if (target) {
        const navHeight = navRef.current?.getBoundingClientRect().height ?? 80;
        const top = Math.max(
          0,
          target.getBoundingClientRect().top + window.scrollY - navHeight - 16
        );
        window.scrollTo({ top, behavior: getScrollBehavior() });
      }
      attempts = 0;
    };

    const scheduleHashScroll = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      attempts = 0;
      frame = window.requestAnimationFrame(scrollToHashTarget);
    };

    scheduleHashScroll();
    window.addEventListener("hashchange", scheduleHashScroll);

    return () => {
      window.removeEventListener("hashchange", scheduleHashScroll);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [isHome]);

  useEffect(() => {
    return () => {
      if (pendingScrollRef.current !== null) {
        clearTimeout(pendingScrollRef.current);
      }
    };
  }, []);

  const handleNavClick = (href: string) => {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) {
      return;
    }

    const scroll = () => {
      const navHeight = navRef.current?.getBoundingClientRect().height ?? 80;
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - navHeight - 16);
      window.scrollTo({ top, behavior: getScrollBehavior() });
      window.history.replaceState(null, "", href);
    };

    if (pendingScrollRef.current !== null) {
      clearTimeout(pendingScrollRef.current);
      pendingScrollRef.current = null;
    }

    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      pendingScrollRef.current = setTimeout(() => {
        pendingScrollRef.current = null;
        scroll();
      }, 0);
    } else {
      scroll();
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 pt-4 sm:pt-5">
      <Container>
        <div
          ref={navRef}
          className={cn("surface-panel transition-theme relative", isScrolled ? "shadow-card" : "")}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
            <Link
              href="/#home"
              onClick={(event) => {
                if (window.location.pathname === "/") {
                  event.preventDefault();
                  handleNavClick("#home");
                }
              }}
              className="group flex items-center gap-3 bg-transparent text-left"
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
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
              {navItems.map(({ href, label }) => {
                const isActive = isHome && href === activeSection;

                return (
                  <Link
                    key={href}
                    href={"/" + href}
                    onClick={(event) => {
                      if (window.location.pathname === "/") {
                        event.preventDefault();
                        handleNavClick(href);
                      }
                      setMobileMenuOpen(false);
                    }}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "transition-theme relative rounded-sm px-3 py-2 text-sm text-muted-foreground no-underline hover:text-foreground",
                      isActive && "text-foreground"
                    )}
                  >
                    {isActive ? (
                      <span
                        className="absolute inset-0 rounded-sm border border-primary/10 bg-primary/10"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="relative">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="transition-theme relative inline-flex h-11 w-11 items-center justify-center rounded-sm border-0 bg-transparent text-muted-foreground hover:text-primary md:hidden"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav"
                aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              >
                <span
                  className={cn(
                    "absolute h-px w-4 bg-current transition-transform duration-200 motion-reduce:transition-none",
                    mobileMenuOpen ? "rotate-45" : "-translate-y-2"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "absolute h-px w-4 bg-current transition-transform duration-200 motion-reduce:transition-none",
                    mobileMenuOpen ? "scale-x-0" : ""
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "absolute h-px w-4 bg-current transition-transform duration-200 motion-reduce:transition-none",
                    mobileMenuOpen ? "-rotate-45" : "translate-y-2"
                  )}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {mobileMenuOpen ? (
            <div id="mobile-nav" className="border-t border-border/60 md:hidden">
              <nav className="grid gap-1 p-3" aria-label="Mobile">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const isActive = isHome && href === activeSection;

                  return (
                    <Link
                      key={href}
                      href={"/" + href}
                      onClick={(event) => {
                        if (window.location.pathname === "/") {
                          event.preventDefault();
                          handleNavClick(href);
                        }
                        setMobileMenuOpen(false);
                      }}
                      aria-current={isActive ? "location" : undefined}
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
                        <span
                          className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
