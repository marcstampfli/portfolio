"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import { type ContactFormData, contactFormSchema } from "@/types";
import { FormField } from "./form-field";
import { TurnstileWidget } from "./turnstile-widget";
import { submitContactMessage } from "@/lib/actions";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";

const socialLinks = [
  { name: "GitHub", href: siteConfig.sameAs[0], icon: Github },
  { name: "LinkedIn", href: siteConfig.sameAs[1], icon: Linkedin },
  { name: "Instagram", href: siteConfig.sameAs[2], icon: Instagram },
];

const contactInfo = [
  { icon: Mail, label: "Email", value: siteConfig.email, href: siteConfig.mailto },
  { icon: MapPin, label: "Location", value: siteConfig.location },
];

type ContactStatus = "sent" | "error" | null;

function getContactStatus(): ContactStatus {
  if (typeof window === "undefined") {
    return null;
  }

  const status = new URLSearchParams(window.location.search).get("contact");
  return status === "sent" || status === "error" ? status : null;
}

function subscribeToContactStatus(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  window.addEventListener("contact-status-change", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("contact-status-change", onChange);
  };
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState(false);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const turnstileRequired = process.env.NODE_ENV === "production";
  const contactStatus = useSyncExternalStore(
    subscribeToContactStatus,
    getContactStatus,
    () => null
  );

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      website: "",
      turnstileToken: "",
    },
  });

  useEffect(() => {
    if (contactStatus) {
      window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    }
  }, [contactStatus]);

  const displayError =
    error ||
    (turnstileError ? "Please complete the verification and try again." : null) ||
    (contactStatus === "error" ? "Failed to send message. Please try again later." : null);
  const displaySubmitted = isSubmitted || contactStatus === "sent";

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
    setTurnstileError(false);
  }, []);

  const handleTurnstileReset = useCallback(() => {
    setTurnstileToken("");
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken("");
    setTurnstileError(true);
  }, []);

  async function onSubmit(data: ContactFormData) {
    if (turnstileRequired && !turnstileToken) {
      setTurnstileError(true);
      setError(null);
      return;
    }

    try {
      window.dispatchEvent(new Event("contact-status-change"));
      setIsSubmitting(true);
      setError(null);
      setIsSubmitted(false);

      const result = await submitContactMessage({ ...data, turnstileToken });

      if (!result.success) {
        throw new Error(result.error ?? "Failed to send message. Please try again later.");
      }

      setIsSubmitted(true);
      form.reset();
      setTurnstileToken("");
      setTurnstileResetKey((key) => key + 1);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to send message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(280px,0.78fr)_minmax(0,1fr)] lg:gap-10">
      <aside className="surface-panel p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Contact Details
        </p>
        <div className="divide-y divide-border/60">
          {contactInfo.map((item) => (
            <div key={item.label} className="flex items-start gap-4 py-7 first:pt-5 last:pb-1">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-primary/20 bg-primary/10 text-primary">
                <item.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="link mt-2 inline-block text-sm leading-6 sm:text-base"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-foreground sm:text-base">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-border/60 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Elsewhere
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <Button key={link.name} variant="outline" asChild className="rounded-sm">
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <link.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {link.name}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </aside>

      <div className="surface-card p-6 sm:p-7">
        <form
          action="/api/contact"
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          aria-busy={isSubmitting}
        >
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...form.register("website")}
            />
          </div>

          <FormField
            name="name"
            label="Name"
            form={form}
            errors={form.formState.errors}
            placeholder="Your name"
            autoComplete="name"
            minLength={2}
            maxLength={120}
          />

          <FormField
            name="email"
            label="Email"
            type="email"
            form={form}
            errors={form.formState.errors}
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={254}
          />

          <FormField
            name="message"
            label="Project Brief"
            fieldType="textarea"
            rows={6}
            form={form}
            errors={form.formState.errors}
            placeholder="What are you building, what is not working, and what kind of help do you need?"
            autoComplete="off"
            minLength={10}
            maxLength={5000}
          />

          <input type="hidden" name="turnstileToken" value={turnstileToken} readOnly />

          <TurnstileWidget
            onToken={handleTurnstileToken}
            onExpired={handleTurnstileReset}
            onError={handleTurnstileError}
            resetKey={turnstileResetKey}
          />

          {displayError ? (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
              <span>{displayError}</span>
            </div>
          ) : null}

          {!displayError && displaySubmitted ? (
            <div
              role="status"
              className="flex items-start gap-3 rounded-md border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden="true" />
              <span>Message received. I’ll be in touch.</span>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-muted-foreground">Short briefs are fine.</p>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
