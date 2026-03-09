import { NextResponse } from "next/server";
import { getPublishedProjects, serializeProjectForApi } from "@/lib/content";
import type { ApiResponse, ProjectResponse } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<ProjectResponse[]>>> {
  try {
    const payload = (await getPublishedProjects()).map(serializeProjectForApi);

    return NextResponse.json({ success: true, data: payload });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching projects:", error);
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
