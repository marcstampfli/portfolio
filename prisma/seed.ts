import PrismaClient from "@prisma/client";
import projectsData from "../data/projects.json" assert { type: "json" };
import experiencesData from "../data/experiences.json" assert { type: "json" };

const prisma = new PrismaClient();

async function main() {
  // Delete all existing data
  await prisma.$transaction([
    prisma.project.deleteMany(),
    prisma.experience.deleteMany(),
  ]);

  // Get projects from JSON
  const projects = projectsData.projects.map((project) => ({
    ...project,
    created_at: new Date(project.created_at),
    updated_at: new Date(project.updated_at),
    developed_at: new Date(project.developed_at),
  }));

  // Seed projects
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      create: project,
      update: project,
    });
  }

  // Get experiences from JSON
  const experiences = experiencesData.experiences.map((experience) => ({
    ...experience,
    start_date: new Date(experience.start_date),
    end_date: experience.end_date ? new Date(experience.end_date) : null,
  }));

  // Seed experiences
  for (const experience of experiences) {
    await prisma.experience.create({
      data: experience,
    });
  }

  console.log("Database has been seeded with consolidated project data");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
