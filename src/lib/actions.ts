"use server";

import { type ContactFormData, contactFormSchema } from "@/types";
import nodemailer from "nodemailer";

const stripTags = (value: string): string => value.replace(/<[^>]*>/g, "").trim();

type ContactEmailPayload = Pick<ContactFormData, "name" | "email" | "message">;

export async function submitContactMessage(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  const sanitizedInput = {
    ...data,
    name: stripTags(data.name),
    message: stripTags(data.message),
  };

  const parsed = contactFormSchema.safeParse(sanitizedInput);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { name, message, website } = parsed.data;
  const email = parsed.data.email.trim().toLowerCase();

  // Honeypot — reject bots
  if (website && website.trim().length > 0) {
    return { success: false, error: "Invalid form submission" };
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return {
      success: false,
      error: "Message could not be sent. Please email directly at marcstampfli@gmail.com",
    };
  }

  try {
    await sendContactEmail({ name, email, message });
    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to submit message:", error);
    }

    return { success: false, error: "Failed to send message. Please try again later." };
  }
}

async function sendContactEmail(data: ContactEmailPayload): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: "marcstampfli@gmail.com",
    replyTo: data.email,
    subject: `New message from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">New portfolio contact</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 80px;"><strong>Name</strong></td>
            <td style="padding: 8px 0;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Email</strong></td>
            <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p style="color: #64748b; margin-bottom: 4px;"><strong>Message</strong></p>
        <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
      </div>
    `,
  });
}
