"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Github, Linkedin, Instagram } from "lucide-react"
import { type ContactFormData, contactFormSchema } from "@/types/form"
import { FormField } from "./form-field"
import { submitContactMessage } from "@/app/actions"

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/marcstampfli",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/marc-stämpfli",
    icon: Linkedin,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/marcstampfli",
    icon: Instagram,
  },
]

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@marcstampfli.com",
    href: "mailto:hello@marcstampfli.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Trinidad and Tobago",
  },
]

export function ContactForm() {
  const prefersReducedMotion = useReducedMotion()
  const [focusedField, setFocusedField] = useState<keyof ContactFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  async function onSubmit(data: ContactFormData) {
    try {
      setIsSubmitting(true)
      setError(null)
      await submitContactMessage(data)
      setIsSubmitted(true)
      form.reset()
    } catch {
      setError("Failed to send message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const animation = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }

  return (
    <div className="mx-auto mt-16 max-w-6xl">
      <div className="grid gap-12 lg:grid-cols-5">
        {/* Contact Info */}
        <motion.div
          className="space-y-8 lg:col-span-2"
          {...animation}
        >
          {/* Contact Details */}
          <div className="space-y-6">
            {contactInfo.map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="group flex items-center gap-4 transition-transform duration-300 hover:translate-x-1"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/30">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-medium text-foreground">Connect With Me</h3>
            <div className="mt-4 flex gap-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-primary/10 p-2 text-primary ring-1 ring-primary/20 transition-all duration-300 hover:bg-primary/20 hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                  aria-label={`Connect on ${link.name}`}
                >
                  <link.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="relative rounded-2xl border border-primary/10 bg-primary/5 p-8 backdrop-blur-sm lg:col-span-3"
          {...animation}
        >
          <motion.form
            role="form"
            aria-label="Contact form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              name="name"
              label="Name"
              form={form}
              errors={form.formState.errors}
              focusedField={focusedField}
              onFocus={setFocusedField}
              onBlur={() => setFocusedField(null)}
            />

            <FormField
              name="email"
              label="Email"
              type="email"
              form={form}
              errors={form.formState.errors}
              focusedField={focusedField}
              onFocus={setFocusedField}
              onBlur={() => setFocusedField(null)}
            />

            <div className="relative" role="textbox" aria-label="Message input">
              <textarea
                {...form.register("message")}
                aria-invalid={!!form.formState.errors.message}
                aria-describedby={form.formState.errors.message ? "message-error" : undefined}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                rows={5}
                className={`w-full rounded-xl border bg-transparent px-4 py-3 pt-6 text-foreground transition-all duration-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${
                  form.formState.errors.message ? "border-destructive" : "border-primary/10"
                }`}
              />
              <motion.label
                htmlFor="message"
                initial={false}
                animate={{
                  y: focusedField === "message" || form.getValues().message ? -24 : 0,
                  scale: focusedField === "message" || form.getValues().message ? 0.85 : 1,
                }}
                transition={{ duration: 0.2 }}
                className={`absolute left-4 origin-left cursor-text text-muted-foreground transition-colors ${
                  focusedField === "message" ? "text-primary" : ""
                }`}
              >
                Message
              </motion.label>

              {form.formState.errors.message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 text-sm text-destructive"
                >
                  {form.formState.errors.message.message}
                </motion.p>
              )}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-sm text-destructive"
                >
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className={`group relative w-full overflow-hidden rounded-xl bg-primary px-4 py-3 text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 ${
                isSubmitted ? "bg-green-500 hover:bg-green-600" : ""
              }`}
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.01 }}
            >
              <motion.span
                initial={false}
                animate={{
                  y: isSubmitted ? -30 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Send className="h-4 w-4 animate-pulse" />
                    Sending...
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    Send Message
                  </>
                )}
              </motion.span>
            </motion.button>
          </motion.form>

          {/* Decorative corner elements */}
          <div className="absolute -right-px -top-px h-8 w-8 rounded-bl-xl border-b border-l border-primary/20" aria-hidden="true" />
          <div className="absolute -bottom-px -left-px h-8 w-8 rounded-tr-xl border-t border-r border-primary/20" aria-hidden="true" />
        </motion.div>
      </div>
    </div>
  )
}