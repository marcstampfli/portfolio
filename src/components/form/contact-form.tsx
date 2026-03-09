"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
import { submitContactMessage } from "@/lib/actions";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";

const socialLinks = [
  { name: "GitHub", href: siteConfig.sameAs[0], icon: Github },
  { name: "LinkedIn", href: siteConfig.sameAs[1], icon: Linkedin },
  { name: "Instagram", href: siteConfig.sameAs[2], icon: Instagram },
];

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}?subject=Hey Marc, I'd like to work with you&body=Hi Marc,%0D%0A%0D%0AI came across your portfolio and I'd love to chat about...`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: siteConfig.location,
  },
];

export function ContactForm() {
  const prefersReducedMotion = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      website: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    try {
      setIsSubmitting(true);
      setError(null);
      setIsSubmitted(false);

      const result = await submitContactMessage(data);

      if (!result.success) {
        throw new Error(result.error);
      }

      setIsSubmitted(true);
      form.reset();
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
      <motion.aside
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="surface-panel p-6 sm:p-7"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Contact Details
        </p>
        <div className="divide-y divide-border/60">
          {contactInfo.map((item, index) => (
            <motion.div
              key={item.label}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex items-start gap-4 py-7 first:pt-5 last:pb-1"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-primary/20 bg-primary/10 text-primary">
                <item.icon className="h-4 w-4" />
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
            </motion.div>
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
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.name}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </motion.aside>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="surface-card p-6 sm:p-7"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
          />

          <FormField
            name="email"
            label="Email"
            type="email"
            form={form}
            errors={form.formState.errors}
            placeholder="you@example.com"
          />

          <FormField
            name="message"
            label="Project Brief"
            fieldType="textarea"
            rows={6}
            form={form}
            errors={form.formState.errors}
            placeholder="What are you building, what is not working, and what kind of help do you need?"
          />

          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                key="error"
                role="alert"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <span>{error}</span>
              </motion.div>
            ) : null}

            {!error && isSubmitted ? (
              <motion.div
                key="success"
                role="status"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-3 rounded-md border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4" />
                <span>Message received. I’ll be in touch.</span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-muted-foreground">Short briefs are fine.</p>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
