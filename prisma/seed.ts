import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

interface Project {
  title: string;
  slug: string;
  description: string;
  content: string;
  project_type: string;
  tech_stack: string[];
  images: string[];
  live_url?: string;
  github_url?: string;
  figma_url?: string;
  client?: string;
  status: string;
  order: number;
  created_at: string;
  updated_at: string;
  developed_at?: string;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  location?: string;
  type?: string;
  description: string;
  tech_stack: string[];
  achievements: string[];
  start_date: string;
  end_date?: string;
}

interface ProjectData {
  projects: Project[];
}

interface ExperienceData {
  experiences: Experience[];
}

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read JSON files
const projectsData = JSON.parse(
  readFileSync(join(__dirname, "../data/projects.json"), "utf-8")
) as ProjectData;

const experiencesData = JSON.parse(
  readFileSync(join(__dirname, "../data/experiences.json"), "utf-8")
) as ExperienceData;

const prisma = new PrismaClient();

function ensureImagePath(imagePath: string): string {
  // Remove any existing /images/projects/ or /projects/ prefix
  const cleanPath = imagePath.replace(/^\/?(images\/)?projects\//, "");
  return `/projects/${cleanPath}`;
}

async function main() {
  try {
    console.log("Starting database seed...");

    // Delete all existing data in correct order to respect foreign key constraints
    console.log("Cleaning existing data...");
    await prisma.$transaction([
      prisma.achievement.deleteMany(),
      prisma.techStack.deleteMany(),
      prisma.experience.deleteMany(),
      prisma.project.deleteMany(),
    ]);

    // Create unique tech stack items
    console.log("Creating tech stack items...");
    const allTechStacks = new Set<string>();
    projectsData.projects.forEach((project: Project) => {
      project.tech_stack.forEach((tech: string) => allTechStacks.add(tech));
    });
    experiencesData.experiences.forEach((experience: Experience) => {
      experience.tech_stack.forEach((tech: string) => allTechStacks.add(tech));
    });

    // Create TechStack records
    const techStackMap = new Map<string, string>();
    for (const tech of Array.from(allTechStacks)) {
      const created = await prisma.techStack.create({
        data: {
          name: tech,
          category: "general", // Default category
        },
      });
      techStackMap.set(tech, created.id);
    }
    console.log(`✓ Created ${allTechStacks.size} tech stack items`);

    // Seed projects
    console.log("Seeding projects...");
    for (const project of projectsData.projects) {
      await prisma.project.create({
        data: {
          title: project.title,
          slug: project.slug,
          description: project.description,
          content: project.content,
          project_type: project.project_type,
          tech_stack: {
            connect: project.tech_stack.map((tech: string) => ({
              id: techStackMap.get(tech),
            })),
          },
          images: JSON.stringify(project.images.map(img => ensureImagePath(img))),
          live_url: project.live_url || null,
          github_url: project.github_url || null,
          figma_url: project.figma_url || null,
          client: project.client || null,
          status: project.status,
          order: project.order,
          created_at: new Date(project.created_at),
          updated_at: new Date(project.updated_at),
          developed_at: project.developed_at ? new Date(project.developed_at) : null,
        },
      });
    }
    console.log(`✓ Seeded ${projectsData.projects.length} projects`);

    // Seed experiences
    console.log("Seeding experiences...");
    for (const experience of experiencesData.experiences) {
      await prisma.experience.create({
        data: {
          title: experience.title.split(" / ")[0],
          position: experience.title.split(" / ")[1] || experience.title.split(" / ")[0],
          company: experience.company,
          period: experience.period,
          location: experience.location || null,
          type: experience.type || null,
          start_date: new Date(experience.start_date),
          end_date: experience.end_date ? new Date(experience.end_date) : null,
          description: experience.description,
          tech_stack: {
            connect: experience.tech_stack.map((tech: string) => ({
              id: techStackMap.get(tech),
            })),
          },
          achievements: {
            create: experience.achievements.map((achievement: string) => ({
              description: achievement,
            })),
          },
        },
      });
    }
    console.log(`✓ Seeded ${experiencesData.experiences.length} experiences`);

    console.log("✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("Failed to seed database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
