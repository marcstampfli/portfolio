"use server";

import { prisma } from "@/lib/prisma";
import {
  type ContactFormData,
  type Experience,
  type ProjectResponse,
  contactFormSchema,
} from "@/types";
import { Resend } from "resend";

// =============================================================================
// Projects
// =============================================================================

export async function getProjects(): Promise<ProjectResponse[]> {
  try {
    const results = await prisma.project.findMany({
      include: {
        tech_stack: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { order: "asc" },
        { created_at: "desc" },
      ],
    });

    return results.map((project) => {
      // Parse images from JSON string
      let images: string[] = [];
      try {
        const parsed = JSON.parse(project.images as string);
        images = Array.isArray(parsed) ? parsed : [];
        // Ensure each image path starts with /projects/
        images = images.map((img) =>
          img.startsWith("/projects/") ? img : `/projects/${img}`
        );
      } catch {
        images = [];
      }

      return {
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        content: project.content,
        project_type: project.project_type,
        tech_stack: project.tech_stack.map((tech) => tech.name),
        images,
        live_url: project.live_url,
        github_url: project.github_url,
        figma_url: project.figma_url,
        client: project.client,
        status: project.status,
        order: project.order,
        created_at: project.created_at.toISOString(),
        updated_at: project.updated_at.toISOString(),
        developed_at: project.developed_at?.toISOString() ?? null,
      };
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching projects:", error);
    }
    return [];
  }
}

// =============================================================================
// Experiences
// =============================================================================

export async function getExperiences(): Promise<Experience[]> {
  try {
    const rawExperiences = await prisma.experience.findMany({
      orderBy: {
        start_date: "desc",
      },
      include: {
        tech_stack: true,
        achievements: true,
      },
    });

    return rawExperiences.map((exp) => ({
      id: exp.id,
      title: exp.title,
      company: exp.company,
      position: exp.position,
      period: exp.period,
      location: exp.location,
      type: exp.type,
      logo: exp.logo,
      start_date: exp.start_date.toISOString(),
      end_date: exp.end_date?.toISOString() ?? null,
      description: exp.description,
      tech_stack: exp.tech_stack.map((tech) => tech.name),
      achievements: exp.achievements.map((a) => a.description),
      created_at: exp.created_at.toISOString(),
      updated_at: exp.updated_at.toISOString(),
    }));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching experiences:", error);
    }
    return [];
  }
}

// =============================================================================
// Contact Form
// =============================================================================

export async function submitContactMessage(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  // Validate input
  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { name, email, message } = parsed.data;

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

async function sendContactEmail(data: ContactFormData): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Portfolio Contact <contact@marcstampfli.com>",
    to: ["hello@marcstampfli.com"],
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
