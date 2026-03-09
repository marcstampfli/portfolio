import { NextResponse } from "next/server";
import { getExperiences } from "@/lib/content";
import type { ApiResponse, Experience } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<Experience[]>>> {
  try {
    const payload = (await getExperiences()).map((experience) => ({
      ...experience,
      start_date: new Date(experience.start_date).toISOString(),
      end_date: experience.end_date ? new Date(experience.end_date).toISOString() : null,
      created_at: experience.created_at ? new Date(experience.created_at).toISOString() : undefined,
      updated_at: experience.updated_at ? new Date(experience.updated_at).toISOString() : undefined,
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
