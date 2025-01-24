"use server";

import { type ContactFormData } from "@/types/form";
import { prisma } from "@/lib/prisma";
import { type Project } from "@/types/project";
import { getExperiences as getExperiencesData } from "@/data/experiences";

export const getExperiences = getExperiencesData;

export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return projects.map(({ tech_stack, images, ...project }: Project) => ({
      ...project,
      tech_stack: JSON.parse(String(tech_stack)) as string[],
      images: JSON.parse(String(images)) as string[],
      // Remove duplicate property declarations below
      id: String(project.id),
      title: String(project.title),
      slug: String(project.slug),
      description: String(project.description),
      content: String(project.content),
      project_type: project.project_type ? String(project.project_type) : "web",
      client: project.client ? String(project.client) : "Unknown",
      github_url: project.github_url ? String(project.github_url) : undefined,
      live_url: project.live_url ? String(project.live_url) : undefined,
      figma_url: project.figma_url ? String(project.figma_url) : undefined,
      status:
        project.status === "published" || project.status === "draft"
          ? project.status
          : "published",
      order: Number(project.order),
      created_at: new Date(project.created_at).toISOString(),
      updated_at: new Date(project.updated_at).toISOString(),
      developed_at: project.developed_at
        ? new Date(project.developed_at).toISOString()
        : new Date().toISOString(),
    }));
  } catch (error) {
    console.error(
      "Error fetching projects:",
      error instanceof Error ? error.message : String(error),
    );
    return [];
  }
}

export async function submitContactMessage(data: ContactFormData) {
  try {
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    });
  } catch (error) {
    console.error(
      "Failed to submit contact message:",
      error instanceof Error ? error.message : String(error),
    );
    throw new Error("Failed to submit contact message");
  }
}
