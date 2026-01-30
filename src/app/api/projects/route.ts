import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, ProjectResponse } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<ProjectResponse[]>>> {
  try {
    const results = await prisma.project.findMany({
      include: {
        tech_stack: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ order: "asc" }, { created_at: "desc" }],
    });

    const payload: ProjectResponse[] = results.map((project) => {
      let images: string[] = [];
      try {
        const parsed = JSON.parse(project.images as string);
        images = Array.isArray(parsed) ? parsed : [];
        images = images.map((img) => (img.startsWith("/projects/") ? img : `/projects/${img}`));
      } catch {
        images = [];
      }

      return {
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        content: project.content,
        project_type: project.project_type,
        tech_stack: project.tech_stack.map((tech) => tech.name),
        images,
        live_url: project.live_url,
        github_url: project.github_url,
        figma_url: project.figma_url,
        client: project.client,
        status: project.status,
        order: project.order,
        created_at: project.created_at.toISOString(),
        updated_at: project.updated_at.toISOString(),
        developed_at: project.developed_at?.toISOString() ?? null,
      };
    });

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
