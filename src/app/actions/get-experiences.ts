"use server";

import { prisma } from "@/lib/prisma";
import { type Experience } from "../../types/experience";
import { parseArrayField } from "../../lib/utils";

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
