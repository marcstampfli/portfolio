import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ContactForm } from "@/components/form/contact-form";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { FloatingNav } from "@/components/shared/floating-nav";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ParallaxBackground } from "@/components/background/parallax-background";
import { PageTransition } from "@/components/shared/page-transition";

export default function Home() {
  return (
    <PageTransition>
      <FloatingNav />
      <ParallaxBackground>
        <main className="relative min-h-screen bg-background/50 backdrop-blur-3xl overflow-hidden">
          <div className="relative">
            <section id="home" className="min-h-screen">
              <HeroSection />
            </section>

            <AboutSection />

            <ExperienceSection />

            <ProjectsSection />

            {/* Contact Section */}
            <section
              id="contact"
              className="relative overflow-hidden py-24 sm:py-32"
            >
              <div className="container px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center relative">
                  <div
                    className="absolute -top-16 left-1/2 h-40 w-[380px] -translate-x-1/2 bg-primary/20 blur-[120px]"
                    aria-hidden="true"
                  ></div>
                  <h2 className="text-4xl font-bold tracking-tight font-heading sm:text-5xl">
                    <span className="bg-gradient-to-r from-primary via-primary/70 to-primary bg-[200%_auto] animate-text-shine bg-clip-text text-transparent">
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
          </div>
        </main>
      </ParallaxBackground>
      <ScrollToTop />
    </PageTransition>
  );
}
