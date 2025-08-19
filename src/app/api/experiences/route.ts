import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type PrismaExperience = {
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
  tech_stack: Array<{
    id: string;
    name: string;
    category: string;
    version: string | null;
  }>;
  achievements: Array<{
    id: string;
    description: string;
  }>;
};

export async function GET() {
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

    // Log raw data for debugging
    

    // Transform the data to match the expected format
    const transformedExperiences = rawExperiences.map(
      (exp: PrismaExperience) => {
        // Extract strings from tech_stack and achievements
        const tech_stack = exp.tech_stack.map((tech) => tech.name);
        const achievements = exp.achievements.map(
          (achievement) => achievement.description,
        );

        // Log transformation for debugging
        console.log("Transforming experience:", {
          id: exp.id,
          tech_stack_before: exp.tech_stack,
          tech_stack_after: tech_stack,
          achievements_before: exp.achievements,
          achievements_after: achievements,
        });

        return {
          id: exp.id,
          title: exp.title,
          company: exp.company,
          position: exp.position,
          period: exp.period,
          location: exp.location,
          type: exp.type,
          start_date: exp.start_date.toISOString(),
          end_date: exp.end_date?.toISOString() || null,
          description: exp.description,
          tech_stack,
          achievements,
          created_at: exp.created_at.toISOString(),
          updated_at: exp.updated_at.toISOString(),
        };
      },
    );

    // Log final transformed data
    console.log(
      "Transformed experiences:",
      JSON.stringify(transformedExperiences, null, 2),
    );

    return NextResponse.json(transformedExperiences);
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 },
    );
  }
}
