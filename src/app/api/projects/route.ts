import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from ".prisma/client";

type ProjectWithTechStack = Prisma.ProjectGetPayload<{
  include: {
    tech_stack: {
      select: {
        name: true;
      };
    };
  };
}>;

interface ProjectResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  project_type: string;
  tech_stack: string[];
  images: string[] | null;
  live_url: string | null;
  github_url: string | null;
  figma_url: string | null;
  client: string | null;
  status: string;
  order: number;
  created_at: Date;
  updated_at: Date;
  developed_at: Date | null;
}

export async function GET() {
  try {
    const results = await prisma.project.findMany({
      include: {
        tech_stack: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const projects: ProjectResponse[] = results.map((project: ProjectWithTechStack) => {
      // Parse the JSON string of images and ensure proper paths
      let images: string[] | null;
      try {
        images = JSON.parse(project.images as string);
        // Ensure each image path starts with /projects/
        if (images) {
          const updatedImages = [];
          for (let i = 0; i < images.length; i++) {
            const img = images[i];
            updatedImages.push(img.startsWith('/projects/') ? img : `/projects/${img}`);
          }
          images = updatedImages;
        }
        
      } catch (e) {
        console.warn(`Failed to parse images for project ${project.id}:`, e);
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
        created_at: project.created_at,
        updated_at: project.updated_at,
        developed_at: project.developed_at,
      };
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
