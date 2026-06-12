"use server";

import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { type ContactFormData, contactFormSchema } from "@/types";
import { escapeHtml } from "@/lib/html";

const stripTags = (value: string): string => value.replace(/<[^>]*>/g, "").trim();
const stripCrlf = (value: string): string => value.replace(/[\r\n]+/g, " ").trim();

// Simple in-memory token bucket per client. Per-instance - for stronger guarantees
// behind multiple serverless instances, swap for a shared store (Redis, Upstash, etc.).
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT = 5;
const submissions = new Map<string, number[]>();
const RATE_WINDOW_SECONDS = RATE_WINDOW_MS / 1000;

function inMemoryRateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(key) ?? []).filter((ts) => now - ts < RATE_WINDOW_MS);

  if (recent.length >= RATE_LIMIT) {
    submissions.set(key, recent);
    return false;
  }

  recent.push(now);
  submissions.set(key, recent);
  return true;
}

async function sharedRateLimit(key: string): Promise<boolean | null> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    return null;
  }

  const windowKey = `contact:${key}:${Math.floor(Date.now() / RATE_WINDOW_MS)}`;
  const response = await fetch(`${redisUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", windowKey],
      ["EXPIRE", windowKey, RATE_WINDOW_SECONDS],
    ]),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Rate limit store failed with status ${response.status}`);
  }

  const [incrementResult] = (await response.json()) as Array<{ result?: number }>;
  return Number(incrementResult?.result ?? RATE_LIMIT + 1) <= RATE_LIMIT;
}

async function rateLimit(key: string): Promise<boolean> {
  try {
    const sharedResult = await sharedRateLimit(key);

    if (sharedResult !== null) {
      return sharedResult;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Shared rate limit failed:", error);
    }

    return false;
  }

  return inMemoryRateLimit(key);
}

async function getClientKey(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown";
  const userAgent = headerList.get("user-agent") || "unknown";
  return `${ip}:${userAgent.slice(0, 80)}`;
}

function buildMailtoHref(email: string): string {
  return `mailto:${encodeURIComponent(email)}`;
}

let transporter: nodemailer.Transporter | null = null;
function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  return transporter;
}

type ContactEmailPayload = Pick<ContactFormData, "name" | "email" | "message">;

export async function submitContactMessage(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  // Honeypot - silently reject bots
  if (data.website && data.website.trim().length > 0) {
    return { success: true };
  }

  const sanitizedInput = {
    ...data,
    name: stripTags(data.name),
    message: stripTags(data.message),
  };

  const parsed = contactFormSchema.safeParse(sanitizedInput);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  const clientKey = await getClientKey();
  if (!(await rateLimit(clientKey))) {
    return { success: false, error: "Too many submissions. Please try again later." };
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return { success: false, error: "Message could not be sent. Please try again later." };
  }

  try {
    await sendContactEmail({
      name: parsed.data.name,
      email: parsed.data.email.trim().toLowerCase(),
      message: parsed.data.message,
    });
    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to submit message:", error);
    }
    return { success: false, error: "Failed to send message. Please try again later." };
  }
}

async function sendContactEmail(data: ContactEmailPayload): Promise<void> {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeMessage = escapeHtml(data.message);
  const subjectName = stripCrlf(data.name);

  await getTransporter().sendMail({
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: data.email,
    subject: `New message from ${subjectName}`,
    text: `Name: ${subjectName}\nEmail: ${stripCrlf(data.email)}\n\nMessage:\n${data.message}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">New portfolio contact</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 80px;"><strong>Name</strong></td>
            <td style="padding: 8px 0;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Email</strong></td>
            <td style="padding: 8px 0;"><a href="${buildMailtoHref(data.email)}">${safeEmail}</a></td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p style="color: #64748b; margin-bottom: 4px;"><strong>Message</strong></p>
        <p style="white-space: pre-wrap; line-height: 1.6;">${safeMessage}</p>
      </div>
    `,
  });
}
