"use server";

import { prisma } from "@/lib/prisma";

interface Experience {
  id: string;
  title: string;
  company: string;
  position: string;
  period: string;
  location: string | null;
  type: string | null;
  start_date: Date;
  end_date: Date | null;
  description: string;
  created_at: Date;
  updated_at: Date;
  tech_stack: string[];
  achievements: string[];
}

interface DbExperience {
  id: string;
  title: string;
  company: string;
  position: string;
  period: string;
  location: string | null;
  type: string | null;
  start_date: Date;
  end_date: Date | null;
  description: string;
  created_at: Date;
  updated_at: Date;
  tech_stack: Array<{ name: string }>;
  achievements: Array<{ description: string }>;
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        start_date: "desc",
      },
      include: {
        tech_stack: true,
        achievements: true,
      },
    });

    return experiences.map((experience: DbExperience) => ({
      ...experience,
      tech_stack: experience.tech_stack.map((tech: { name: string }) => tech.name),
      achievements: experience.achievements.map((achievement: { description: string }) => achievement.description),
    }));
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    throw new Error("Failed to fetch experiences");
  }
}
