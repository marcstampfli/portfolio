import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, Experience } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<Experience[]>>> {
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

    const payload: Experience[] = rawExperiences.map((exp) => ({
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

    return NextResponse.json({ success: true, data: payload });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching experiences:", error);
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}
