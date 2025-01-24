import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import projectsData from "../data/projects.json" assert { type: "json" };
import experiencesData from "../data/experiences.json" assert { type: "json" };

const prisma = new PrismaClient();

async function main() {
  // Delete all existing data in correct order to respect foreign key constraints
  await prisma.achievement.deleteMany();
  await prisma.techStack.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();

  // Create unique tech stack items
  const allTechStacks = new Set<string>();
  projectsData.projects.forEach((project) => {
    project.tech_stack.forEach((tech) => allTechStacks.add(tech));
  });
  experiencesData.experiences.forEach((experience) => {
    experience.tech_stack.forEach((tech) => allTechStacks.add(tech));
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

  // Seed projects
  for (const project of projectsData.projects) {
    await prisma.project.create({
      data: {
        ...project,
        tech_stack: {
          connect: project.tech_stack.map((tech) => ({
            id: techStackMap.get(tech),
          })),
        },
        images: project.images.map((img) => `/images/projects/${img}`),
        created_at: new Date(project.created_at),
        updated_at: new Date(project.updated_at),
        developed_at: new Date(project.developed_at),
      },
    });
  }

  // Seed experiences
  for (const experience of experiencesData.experiences) {
    await prisma.experience.create({
      data: {
        title: experience.title.split(" / ")[0],
        position:
          experience.title.split(" / ")[1] || experience.title.split(" / ")[0],
        company: experience.company,
        period: experience.period,
        location: experience.location || null,
        type: experience.type || null,
        start_date: new Date(experience.start_date),
        end_date: experience.end_date ? new Date(experience.end_date) : null,
        description: experience.description,
        tech_stack: {
          connect: experience.tech_stack.map((tech) => ({
            id: techStackMap.get(tech),
          })),
        },
        achievements: {
          create: experience.achievements.map((achievement) => ({
            description: achievement,
          })),
        },
      },
    });
  }

  console.log("Database has been seeded with normalized data structure");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
