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
    console.log("Starting getProjects...");

    const projects = await prisma.project.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    console.log("Raw projects:", projects);

    if (!projects) {
      console.log("No projects returned from database");
      return null;
    }

    const serializedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content,
      category: project.category,
      tags: Array.isArray(project.tags) ? project.tags : [],
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack : [],
      images: Array.isArray(project.images) ? project.images : [],
      client: project.client || undefined,
      github_url: project.github_url || undefined,
      live_url: project.live_url || undefined,
      figma_url: project.figma_url || undefined,
      status: project.status,
      order: project.order,
      created_at: project.created_at.toISOString(),
      updated_at: project.updated_at.toISOString(),
    }));

    console.log("Serialized projects:", serializedProjects);
    return serializedProjects;
  } catch (error) {
    console.error("Error in getProjects:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
}

export async function getExperiences() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return experiences.map((experience) => ({
      ...experience,
      tech_stack: parseArrayField(experience.tech_stack),
      achievements: parseArrayField(experience.achievements),
    }));
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    throw new Error("Failed to fetch experiences");
  }
}
