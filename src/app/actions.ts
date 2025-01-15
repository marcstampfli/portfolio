"use server";

import { type ContactFormData } from "@/types/form";
import { prisma } from "@/lib/prisma";

const parseArrayField = (field: string | string[]) => {
  if (Array.isArray(field)) return field;
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [field];
  } catch {
    return field.split(",").map((item) => item.trim());
  }
};

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
    console.error("Failed to submit contact message:", error);
    throw new Error("Failed to submit contact message");
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return projects
      .filter((project): project is NonNullable<typeof project> => !!project)
      .map((project) => ({
        id: String(project.id),
        title: String(project.title),
        slug: String(project.slug),
        description: String(project.description),
        content: String(project.content),
        category: String(project.category),
        tags: Array.isArray(project.tags) ? project.tags.map(String) : [],
        tech_stack: Array.isArray(project.tech_stack)
          ? project.tech_stack.map(String)
          : [],
        images: Array.isArray(project.images)
          ? project.images.map((img) => `/images/projects/${img}`)
          : ["/images/placeholder.svg"],
        client: project.client ? String(project.client) : null,
        github_url: project.github_url ? String(project.github_url) : null,
        live_url: project.live_url ? String(project.live_url) : null,
        figma_url: project.figma_url ? String(project.figma_url) : null,
        status: String(project.status),
        order: Number(project.order),
        created_at: project.created_at.toISOString(),
        updated_at: project.updated_at.toISOString(),
      }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return null;
  }
}

import { type Experience } from "@prisma/client";

export async function getExperiences() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return experiences.map((experience: Experience) => ({
      ...experience,
      tech_stack: parseArrayField(experience.tech_stack),
      achievements: parseArrayField(experience.achievements),
    }));
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    throw new Error("Failed to fetch experiences");
  }
}
