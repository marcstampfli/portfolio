import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const parsedData = contactFormSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { success: false, error: "Invalid form data" },
        { status: 400 },
      );
    }

    const { name, email, message } = parsedData.data;

    // Create contact message
    const contact = await prisma.contactMessage.create({
      data: { name, email, message },
    });

    // Send email notification
    try {
      await sendContactEmail({ name, email, message });
    } catch (emailError) {
      console.error("Failed to send contact email:", emailError);
    }

    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit contact message:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function sendContactEmail(data: ContactFormData) {
  // Implementation for sending email
  // This could use a service like Resend or Nodemailer
  // For now, we'll just log the email data
  console.log("Contact email data:", data);
}
