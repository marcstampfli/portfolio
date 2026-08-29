"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/nav";
import { cn, getScrollBehavior } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Container } from "@/components/ui/container";

const navHrefs = new Set(navItems.map(({ href }) => href));
const NAVIGATION_GAP = 16;
const ACTIVE_SECTION_TOLERANCE = 1;

function getNavHrefFromHash(hash: string): string | null {
  if (navHrefs.has(hash)) {
    return hash;
  }

  // Recover gracefully from a malformed fragment such as
  // `#experience#about`, which can otherwise leave the page at the top with
  // no active section. The most recently requested valid section wins.
  const fragments = hash.split("#").filter(Boolean);
  for (let index = fragments.length - 1; index >= 0; index -= 1) {
    const candidate = "#" + fragments[index];
    if (navHrefs.has(candidate)) {
      return candidate;
    }
  }

  return null;
}

function getNavigationOffset(element: HTMLElement | null): number {
  return element?.getBoundingClientRect().bottom ?? 80;
}

function isAtNavigationTarget(element: HTMLElement, navigationOffset: number): boolean {
  const bounds = element.getBoundingClientRect();
  const activationLine = navigationOffset + NAVIGATION_GAP + ACTIVE_SECTION_TOLERANCE;

  return bounds.top <= activationLine && bounds.bottom > activationLine;
}

export function FloatingNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pendingScrollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSectionFrameRef = useRef<number | null>(null);
  const pendingActiveSectionRef = useRef<string | null>(null);
  const pendingActiveSectionExpiresAtRef = useRef(0);

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
      pendingActiveSectionRef.current = null;
      pendingActiveSectionExpiresAtRef.current = 0;
      return;
    }

    const syncActiveSection = () => {
      const rawHash = window.location.hash;
      const section = getNavHrefFromHash(rawHash);

      if (section && rawHash !== section) {
        const url = new URL(window.location.href);
        url.hash = section.slice(1);
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      }

      const target = section ? document.getElementById(section.slice(1)) : null;
      const navigationOffset = getNavigationOffset(navRef.current);
      const hasPendingTarget =
        section && (!target || !isAtNavigationTarget(target, navigationOffset));

      pendingActiveSectionRef.current = hasPendingTarget ? section : null;
      pendingActiveSectionExpiresAtRef.current = hasPendingTarget ? performance.now() + 5000 : 0;
      setActiveSection(section);
    };

    syncActiveSection();
    window.addEventListener("hashchange", syncActiveSection);
    window.addEventListener("popstate", syncActiveSection);

    return () => {
      window.removeEventListener("hashchange", syncActiveSection);
      window.removeEventListener("popstate", syncActiveSection);
    };
  }, [isHome, pathname]);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    let frame: number | null = null;

    const updateActiveSection = () => {
      if (frame !== null) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = null;
        const sections = navItems
          .map(({ href }) => document.querySelector<HTMLElement>(href))
          .filter((element): element is HTMLElement => element !== null);

        // The home page can arrive through a streamed route transition. Wait
        // for its sections instead of permanently disabling the scroll spy.
        if (sections.length === 0) {
          return;
        }

        const navigationOffset = getNavigationOffset(navRef.current);
        const currentHashSection = getNavHrefFromHash(window.location.hash);
        let pendingSection = pendingActiveSectionRef.current;

        // A rapid cross-route click can finish an older transition after the
        // URL already contains the newer destination. Never let that stale
        // request override the section represented by the current hash.
        if (pendingSection !== currentHashSection) {
          pendingActiveSectionRef.current = null;
          pendingActiveSectionExpiresAtRef.current = 0;
          pendingSection = null;
        }

        // A route transition can briefly leave the old section visible while
        // the hash destination is being restored. Keep the requested section
        // active until its target reaches the same line used by hash scrolling.
        if (pendingSection) {
          const target = document.getElementById(pendingSection.slice(1));
          const expired = performance.now() >= pendingActiveSectionExpiresAtRef.current;

          if (!expired && (!target || !isAtNavigationTarget(target, navigationOffset))) {
            return;
          }

          pendingActiveSectionRef.current = null;
          pendingActiveSectionExpiresAtRef.current = 0;
        }

        const activationLine = navigationOffset + NAVIGATION_GAP + ACTIVE_SECTION_TOLERANCE;
        let currentSection = sections[0];

        for (const section of sections) {
          if (section.getBoundingClientRect().top <= activationLine) {
            currentSection = section;
          } else {
            break;
          }
        }

        setActiveSection("#" + currentSection.id);
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    const mutationObserver = new MutationObserver(updateActiveSection);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      mutationObserver.disconnect();
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [isHome]);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    let frame: number | null = null;
    let attempts = 0;

    const scrollToHashTarget = () => {
      const requestedHash = getNavHrefFromHash(window.location.hash);
      const targetId = requestedHash?.slice(1) ?? "";
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
        const navigationOffset = getNavigationOffset(navRef.current);
        const top = Math.max(
          0,
          target.getBoundingClientRect().top + window.scrollY - navigationOffset - NAVIGATION_GAP
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
    window.addEventListener("popstate", scheduleHashScroll);

    return () => {
      window.removeEventListener("hashchange", scheduleHashScroll);
      window.removeEventListener("popstate", scheduleHashScroll);
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
      if (pendingSectionFrameRef.current !== null) {
        window.cancelAnimationFrame(pendingSectionFrameRef.current);
      }
    };
  }, []);

  const handleNavClick = (href: string) => {
    const targetId = href.slice(1);
    const target = document.getElementById(targetId);
    const navigationOffset = getNavigationOffset(navRef.current);
    const hasPendingTarget = !target || !isAtNavigationTarget(target, navigationOffset);

    pendingActiveSectionRef.current = hasPendingTarget ? href : null;
    pendingActiveSectionExpiresAtRef.current = hasPendingTarget ? performance.now() + 5000 : 0;
    setActiveSection(href);

    const url = new URL(window.location.href);
    url.pathname = "/";
    url.search = "";
    url.hash = targetId;
    window.history.replaceState(null, "", url.pathname + url.hash);

    if (pendingSectionFrameRef.current !== null) {
      window.cancelAnimationFrame(pendingSectionFrameRef.current);
      pendingSectionFrameRef.current = null;
    }

    let attempts = 0;
    const scroll = () => {
      const currentTarget = document.getElementById(targetId);
      if (!currentTarget) {
        if (attempts < 60) {
          attempts += 1;
          pendingSectionFrameRef.current = window.requestAnimationFrame(scroll);
        } else {
          pendingSectionFrameRef.current = null;
        }
        return;
      }

      pendingSectionFrameRef.current = null;
      const navigationOffset = getNavigationOffset(navRef.current);
      const top = Math.max(
        0,
        currentTarget.getBoundingClientRect().top +
          window.scrollY -
          navigationOffset -
          NAVIGATION_GAP
      );
      window.scrollTo({ top, behavior: getScrollBehavior() });
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

  const handleNavigationClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    setMobileMenuOpen(false);

    if (isHome) {
      handleNavClick(href);
      return;
    }

    // Keep cross-route navigation deterministic even if a user clicks two
    // destinations before the first App Router transition has completed.
    router.push("/" + href, { scroll: false });
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
              onClick={(event) => handleNavigationClick(event, "#home")}
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
                    onClick={(event) => handleNavigationClick(event, href)}
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
                      onClick={(event) => handleNavigationClick(event, href)}
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
