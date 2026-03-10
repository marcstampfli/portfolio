import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { FloatingNav } from "@/components/shared/floating-nav";
import { ParallaxBackground } from "@/components/background/parallax-background";
import { PageTransition } from "@/components/shared/page-transition";
import { ScrollProgressBar } from "@/components/shared/scroll-progress-bar";
import { SkipToContent } from "@/components/shared/skip-to-content";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/shared/section-header";
import { getExperiences, getPublishedProjects } from "@/lib/content";

const ExperienceSection = dynamic(() =>
  import("@/components/sections/experience-section").then((m) => m.ExperienceSection)
);
const ProjectsSection = dynamic(() => import("@/components/sections/projects-section"));
const ContactForm = dynamic(() =>
  import("@/components/form/contact-form").then((m) => m.ContactForm)
);

export default async function Home() {
  const [experiences, projects] = await Promise.all([getExperiences(), getPublishedProjects()]);

  return (
    <PageTransition>
      <SkipToContent targetId="main-content" />
      <ScrollProgressBar />
      <FloatingNav />
      <ParallaxBackground>
        <main id="main-content" className="relative min-h-screen pt-24 sm:pt-28" tabIndex={-1}>
          <div className="relative">
            <section id="home" className="min-h-screen">
              <HeroSection />
            </section>

            <AboutSection />

            <ExperienceSection experiences={experiences} />

            <ProjectsSection projects={projects} />

            <AnimatedSection animation="fade-up" delay={0.1}>
              <section
                id="contact"
                className="section-shell relative overflow-hidden"
                aria-labelledby="contact-heading"
              >
                <Container>
                  <div className="surface-panel relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                    <SectionHeader
                      titleId="contact-heading"
                      eyebrow="Contact"
                      title="Have a project in mind?"
                      subtitle="Describe the project. I'll follow up with a direct response."
                      align="center"
                      className="mx-auto mb-12 max-w-3xl"
                      titleClassName="text-3xl sm:text-4xl lg:text-5xl"
                    />
                    <ContactForm />
                  </div>
                </Container>
              </section>
            </AnimatedSection>
          </div>
        </main>
      </ParallaxBackground>
      <ScrollToTop />
    </PageTransition>
  );
}
