import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnalyticsPreferenceButton } from "@/components/shared/analytics-preference-button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy overview",
  description: "A technical overview of how this portfolio handles analytics and contact messages.",
  alternates: {
    canonical: siteConfig.url + "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="relative min-h-screen pt-24 sm:pt-28">
      <Container size="narrow">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/"
            className="flex w-fit shrink-0 items-center gap-2 whitespace-nowrap text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
        </nav>

        <article className="prose prose-slate max-w-none dark:prose-invert">
          <h1>Privacy overview</h1>
          <p>
            This page explains the main data flows on this portfolio in plain language. It is a
            technical overview, not a substitute for advice about legal requirements that may apply
            to a particular visitor or project.
          </p>

          <h2>Optional analytics</h2>
          <p>
            Google Analytics and Vercel Analytics are not loaded until you choose “Allow analytics”
            in the consent prompt. Your choice is stored in this browser so the prompt does not
            reappear on every visit. Choosing “Decline” prevents those scripts from loading.
          </p>
          <AnalyticsPreferenceButton />

          <h2>Contact messages</h2>
          <p>
            When you submit the contact form, your name, email address, and project brief are sent
            through Gmail SMTP to {siteConfig.email} so a reply can be made. The portfolio does not
            store those fields in an application database. The form is protected with validation, a
            bot honeypot, request limits, and same-origin checks.
          </p>

          <h2>Operational processing</h2>
          <p>
            The hosting and email providers may process network and delivery metadata as part of
            operating their services. Do not include passwords, payment details, or other highly
            sensitive information in a project brief.
          </p>

          <h2>Questions</h2>
          <p>For a question about a message you submitted, email {siteConfig.email} directly.</p>
        </article>
      </Container>
    </main>
  );
}
