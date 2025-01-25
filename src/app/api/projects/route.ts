import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { isValidProjectImage } from "@/lib/utils";
import { logger } from "@/lib/logger";

interface DatabaseProject {
  id: string;
  title: string;
  description: string;
  project_type: string;
  live_url: string | null;
  github_url: string | null;
  figma_url: string | null;
  images: string[] | null;
  tech_stack: { name: string }[];
  created_at: Date;
  updated_at: Date;
}

interface TransformedProject {
  id: string;
  title: string;
  description: string;
  project_type: string;
  live_url: string | null;
  github_url: string | null;
  figma_url: string | null;
  images: string[] | null;
  tech_stack: string[];
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        project_type: true,
        live_url: true,
        github_url: true,
        figma_url: true,
        images: true,
        created_at: true,
        updated_at: true,
        tech_stack: {
          select: {
            name: true,
          },
        },
      },
    });

    const transformedProjects: TransformedProject[] = projects.map(
      (project: DatabaseProject) => {
        const validImages = project.images?.filter((image) => {
          const isValid = isValidProjectImage(image);
          if (!isValid) {
            logger.warn({
              message: "Invalid project image filtered out",
              projectId: project.id,
              path: image
            });
          }
          return isValid;
        });

        if (project.images?.length && !validImages?.length) {
          logger.warn({
            message: "All project images were invalid",
            projectId: project.id,
            originalImageCount: project.images.length
          });
        }

        return {
          ...project,
          images: validImages?.length ? validImages : null,
          tech_stack: project.tech_stack.map((tech) => tech.name),
          created_at: project.created_at.toISOString(),
          updated_at: project.updated_at.toISOString(),
        };
      }
    );

    return NextResponse.json(transformedProjects);
  } catch (error) {
    logger.error({
      message: "Failed to fetch projects",
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
