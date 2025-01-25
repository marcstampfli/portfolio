import { prisma } from "@/lib/prisma";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  return await prisma.project.findMany({
    orderBy: {
      order: "asc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      content: true,
      project_type: true,
      tech_stack: true,
      images: true,
      client: true,
      github_url: true,
      live_url: true,
      figma_url: true,
      status: true,
      order: true,
      created_at: true,
      updated_at: true,
      developed_at: true,
    },
  });
}
