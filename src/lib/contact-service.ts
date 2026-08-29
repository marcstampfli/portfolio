import "server-only";

import { headers } from "next/headers";
import { createHash, randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import { type ContactFormData, contactFormSchema } from "@/types";
import { escapeHtml } from "@/lib/html";

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_WINDOW_SECONDS = RATE_WINDOW_MS / 1000;
const RATE_LIMIT = 5;
const GLOBAL_RATE_LIMIT = 50;
const MAX_LOCAL_RATE_KEYS = 10_000;
const REDIS_TIMEOUT_MS = 1_500;
const isProduction = process.env.NODE_ENV === "production";
const submissions = new Map<string, number[]>();

type HeaderReader = {
  get: (name: string) => string | null;
};

type ContactResult = {
  success: boolean;
  error?: string;
};

function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function pruneLocalRateLimit(now: number): void {
  for (const [key, timestamps] of submissions) {
    if (timestamps.every((timestamp) => now - timestamp >= RATE_WINDOW_MS)) {
      submissions.delete(key);
    }
  }

  while (submissions.size > MAX_LOCAL_RATE_KEYS) {
    const oldestKey = submissions.keys().next().value;
    if (!oldestKey) {
      break;
    }
    submissions.delete(oldestKey);
  }
}

function inMemoryRateLimit(key: string, limit: number): boolean {
  const now = Date.now();
  pruneLocalRateLimit(now);

  const recent = (submissions.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_WINDOW_MS
  );

  if (recent.length >= limit) {
    submissions.set(key, recent);
    return false;
  }

  recent.push(now);
  submissions.set(key, recent);
  return true;
}

function hashRateLimitKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

async function sharedRateLimit(key: string, limit: number): Promise<boolean | null> {
  const rawRedisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!rawRedisUrl || !redisToken) {
    return null;
  }

  let redisPipelineUrl: string;
  try {
    const redisBaseUrl = new URL(rawRedisUrl);
    if (redisBaseUrl.protocol !== "https:" || redisBaseUrl.username || redisBaseUrl.password) {
      return null;
    }
    redisPipelineUrl = new URL("/pipeline", redisBaseUrl).toString();
  } catch {
    return null;
  }

  const windowKey =
    "contact:" + hashRateLimitKey(key) + ":" + Math.floor(Date.now() / RATE_WINDOW_MS);
  const script =
    "local count = redis.call('INCR', KEYS[1]); " +
    "if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]); end; " +
    "return count";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REDIS_TIMEOUT_MS);

  try {
    const response = await fetch(redisPipelineUrl, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + redisToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([["EVAL", script, 1, windowKey, String(RATE_WINDOW_SECONDS)]]),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("rate-limit store returned " + response.status);
    }

    const payload = (await response.json()) as unknown;
    const firstResult = Array.isArray(payload) ? payload[0] : null;
    const count =
      firstResult && typeof firstResult === "object" && "result" in firstResult
        ? Number(firstResult.result)
        : Number.NaN;

    if (!Number.isFinite(count)) {
      throw new Error("rate-limit store returned an invalid count");
    }

    return count <= limit;
  } finally {
    clearTimeout(timeout);
  }
}

async function rateLimit(key: string, limit: number): Promise<boolean> {
  try {
    const sharedResult = await sharedRateLimit(key, limit);
    if (sharedResult !== null) {
      return sharedResult;
    }
  } catch (error) {
    console.warn(
      "Shared contact rate limit unavailable",
      error instanceof Error ? error.name : "unknown error"
    );

    if (isProduction) {
      // If a configured shared limiter fails, fail closed rather than allowing
      // an outage to become an abuse-control bypass.
      return false;
    }
  }

  // Redis is optional for this low-volume portfolio. When it is not configured,
  // retain the bounded per-instance limiter used before shared rate limiting
  // was added. Configure Upstash later if cross-instance enforcement is needed.
  return inMemoryRateLimit(key, limit);
}

async function getClientKey(headerReader?: HeaderReader): Promise<string> {
  const headerList = headerReader ?? (await headers());
  // These values are only reliable when the hosting proxy overwrites them.
  // Vercel's provider-specific signal takes precedence; standard proxy headers
  // are fallbacks for a documented, sanitizing reverse-proxy deployment.
  const vercelForwarded = headerList.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  const directIp = headerList.get("x-real-ip")?.trim();
  const forwardedValues = headerList.get("x-forwarded-for")?.split(",");
  const forwardedIp = forwardedValues?.[0]?.trim();
  const ip = vercelForwarded || directIp || forwardedIp || "unknown";

  return headerSafe(ip).slice(0, 128) || "unknown";
}

function buildMailtoHref(email: string): string {
  return "mailto:" + encodeURIComponent(email);
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    connectionTimeout: 5_000,
    greetingTimeout: 5_000,
    socketTimeout: 10_000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  return transporter;
}

type ContactEmailPayload = Pick<ContactFormData, "name" | "email" | "message">;

async function sendContactEmail(data: ContactEmailPayload): Promise<void> {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeMessage = escapeHtml(data.message);
  const subjectName = headerSafe(data.name);
  const safeReplyTo = headerSafe(data.email);
  const gmailUser = headerSafe(process.env.GMAIL_USER ?? "");
  const messageId = randomUUID();
  const html = [
    '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">',
    '<h2 style="color: #0ea5e9;">New portfolio contact</h2>',
    '<table style="width: 100%; border-collapse: collapse;">',
    '<tr><td style="padding: 8px 0; color: #64748b; width: 80px;"><strong>Name</strong></td>',
    '<td style="padding: 8px 0;">' + safeName + "</td></tr>",
    '<tr><td style="padding: 8px 0; color: #64748b;"><strong>Email</strong></td>',
    '<td style="padding: 8px 0;"><a href="' +
      buildMailtoHref(data.email) +
      '">' +
      safeEmail +
      "</a></td></tr>",
    "</table>",
    '<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />',
    '<p style="color: #64748b; margin-bottom: 4px;"><strong>Message</strong></p>',
    '<p style="white-space: pre-wrap; line-height: 1.6;">' + safeMessage + "</p>",
    '<p style="color: #94a3b8; font-size: 12px;">Message ID: ' + messageId + "</p>",
    "</div>",
  ].join("");

  await getTransporter().sendMail({
    from: '"Portfolio Contact" <' + gmailUser + ">",
    to: gmailUser,
    replyTo: safeReplyTo,
    subject: "New message from " + subjectName,
    text:
      "Name: " +
      subjectName +
      "\nEmail: " +
      headerSafe(data.email) +
      "\n\nMessage:\n" +
      data.message +
      "\n\nMessage ID: " +
      messageId,
    html,
  });
}

export async function processContactMessage(
  data: unknown,
  headerReader?: HeaderReader
): Promise<ContactResult> {
  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  if (parsed.data.website.length > 0) {
    return { success: true };
  }

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPassword = process.env.GMAIL_APP_PASSWORD?.trim();
  if (!gmailUser || !gmailPassword || !contactFormSchema.shape.email.safeParse(gmailUser).success) {
    return { success: false, error: "Message could not be sent. Please try again later." };
  }

  const clientKey = await getClientKey(headerReader);
  if (!(await rateLimit("ip:" + clientKey, RATE_LIMIT))) {
    return { success: false, error: "Too many submissions. Please try again later." };
  }

  if (!(await rateLimit("global", GLOBAL_RATE_LIMIT))) {
    return { success: false, error: "Too many submissions. Please try again later." };
  }

  try {
    await sendContactEmail({
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      message: parsed.data.message,
    });
    return { success: true };
  } catch (error) {
    console.error(
      "Failed to submit contact message",
      error instanceof Error ? error.name : "unknown error"
    );
    return { success: false, error: "Failed to send message. Please try again later." };
  }
}
