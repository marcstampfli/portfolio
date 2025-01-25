import { type Experience } from "@/types/experience";
import { prisma } from "@/lib/prisma";

type RawExperience = {
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
  tech_stack: Array<{ name: string }>;
  achievements: Array<{ description: string }>;
  created_at: Date;
  updated_at: Date;
};

export async function getExperiences(): Promise<Experience[]> {
  console.log("DB Layer: Starting getExperiences");
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

    console.log("DB Layer: Raw experiences:", rawExperiences);

    if (!rawExperiences || rawExperiences.length === 0) {
      console.log("DB Layer: No experiences found");
      return [];
    }

    const processedExperiences = rawExperiences.map(
      (rawExp: RawExperience) => ({
        ...rawExp,
        tech_stack: rawExp.tech_stack.map((tech) => tech.name),
        achievements: rawExp.achievements.map(
          (achievement) => achievement.description,
        ),
      }),
    );

    console.log("DB Layer: Processed experiences:", processedExperiences);
    return processedExperiences;
  } catch (error) {
    console.error("DB Layer: Failed to fetch experiences:", error);
    throw new Error("Failed to fetch experiences");
  }
}
