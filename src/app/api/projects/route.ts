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
  description: string;
  project_type: string;
  tech_stack: string[];
  images: string[] | null;
  live_url: string | null;
  github_url: string | null;
  figma_url: string | null;
  created_at: Date;
  updated_at: Date;
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
        description: project.description,
        project_type: project.project_type,
        tech_stack: project.tech_stack.map((tech) => tech.name),
        images,
        live_url: project.live_url,
        github_url: project.github_url,
        figma_url: project.figma_url,
        created_at: project.created_at,
        updated_at: project.updated_at,
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
