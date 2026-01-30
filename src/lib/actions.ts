"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { type ContactFormData, contactFormSchema } from "@/types";
import { Resend } from "resend";

// =============================================================================
// Contact Form
// =============================================================================

const stripTags = (value: string): string => value.replace(/<[^>]*>/g, "").trim();

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, RateLimitEntry>();

type ContactEmailPayload = Pick<ContactFormData, "name" | "email" | "message">;

async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for") ?? "";
  const realIp = headerStore.get("x-real-ip") ?? "";
  const ip = forwardedFor.split(",")[0]?.trim() || realIp || "unknown";
  return ip;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  rateLimitStore.set(key, entry);
  return false;
}

export async function submitContactMessage(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  const sanitizedInput = {
    ...data,
    name: stripTags(data.name),
    message: stripTags(data.message),
  };

  // Validate input
  const parsed = contactFormSchema.safeParse(sanitizedInput);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { name, email, message, website } = parsed.data;

  if (website && website.trim().length > 0) {
    return { success: false, error: "Invalid form submission" };
  }

  const clientIp = await getClientIp();
  const rateLimitKey = `contact:${clientIp}`;
  if (isRateLimited(rateLimitKey)) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  try {
    // Save to database
    await prisma.contactMessage.create({
      data: { name, email, message },
    });

    // Send email notification if Resend is configured
    if (process.env.RESEND_API_KEY) {
      await sendContactEmail({ name, email, message });
    }

    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to submit contact message:", error);
    }
    return { success: false, error: "Failed to submit message" };
  }
}

async function sendContactEmail(data: ContactEmailPayload): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Portfolio Contact <contact@marcstampfli.com>",
    to: ["marcstampfli@gmail.com"],
    replyTo: data.email,
    subject: `New Contact Message from ${data.name}`,
    text: `
Name: ${data.name}
Email: ${data.email}

Message:
${data.message}
    `.trim(),
  });
}
