import { Suspense } from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ContactForm } from "@/components/form/contact-form";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { FloatingNav } from "@/components/shared/floating-nav";
import { ParallaxBackground } from "@/components/background/parallax-background";
import { PageTransition } from "@/components/shared/page-transition";
import { ExperienceSection } from "@/components/sections/experience-section";
import ProjectsSection from "@/components/sections/projects-section";
import { ScrollProgressBar } from "@/components/shared/scroll-progress-bar";
import { SkipToContent } from "@/components/shared/skip-to-content";
import { ExperienceSkeleton, ProjectsSkeleton } from "@/components/shared/section-skeletons";
import { SectionDivider, DecorativeGlow } from "@/components/shared/section-divider";
import { AnimatedSection } from "@/components/shared/animated-section";

export default function Home() {
  return (
    <PageTransition>
      {/* Accessibility: Skip to main content link */}
      <SkipToContent targetId="main-content" />
      
      {/* Scroll progress indicator */}
      <ScrollProgressBar />
      
      <FloatingNav />
      <ParallaxBackground>
        <main 
          id="main-content"
          className="relative min-h-screen bg-background/50 backdrop-blur-3xl"
          tabIndex={-1}
        >
          <div className="relative">
            <section id="home" className="min-h-screen">
              <HeroSection />
            </section>

            <SectionDivider variant="fade" />

            <AboutSection />

            <SectionDivider variant="gradient" />

            <Suspense fallback={<ExperienceSkeleton />}>
              <ExperienceSection />
            </Suspense>

            <SectionDivider variant="gradient" />

            <Suspense fallback={<ProjectsSkeleton />}>
              <ProjectsSection />
            </Suspense>

            <SectionDivider variant="dots" />

            {/* Contact Section */}
            <AnimatedSection animation="fade-up" delay={0.1}>
              <section
                id="contact"
                className="relative overflow-hidden py-24 sm:py-32"
                aria-labelledby="contact-heading"
              >
                <div className="container px-4 sm:px-6 lg:px-8">
                  <div className="relative mx-auto max-w-2xl text-center">
                    <DecorativeGlow position="top" size="md" />
                    <h2 
                      id="contact-heading"
                      className="font-heading text-4xl font-bold tracking-tight sm:text-5xl"
                    >
                      <span className="animate-text-shine bg-gradient-to-r from-primary via-primary/70 to-primary bg-[200%_auto] bg-clip-text text-transparent">
                        Connect with Me
                      </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                      Ready to explore the possibilities? Let&apos;s connect and
                      discuss your next digital project.
                    </p>
                  </div>
                  <ContactForm />
                </div>
              </section>
            </AnimatedSection>
          </div>
        </main>
      </ParallaxBackground>
      <ScrollToTop />
    </PageTransition>
  );
}