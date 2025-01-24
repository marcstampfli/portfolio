import type { Experience, Project } from ".prisma/client";

type CreateInput<T> = Omit<T, "id" | "created_at" | "updated_at">;

// Validate tech stack items
export function validateTechStack(tech: string): boolean {
  const allowedCategories = ["language", "framework", "tool", "platform"];
  const [name, category] = tech.split(":");

  return Boolean(
    name?.trim() &&
      (!category || allowedCategories.includes(category.toLowerCase())),
  );
}

// Convert date to UTC
export function toUTCDate(date: Date | string): Date {
  if (typeof date === "string") {
    return new Date(new Date(date).toISOString());
  }
  return new Date(date.toISOString());
}

// Validate experience data
export function validateExperience(exp: CreateInput<Experience>): boolean {
  return Boolean(exp.title && exp.company && exp.start_date && exp.description);
}

// Validate project data
export function validateProject(proj: CreateInput<Project>): boolean {
  return Boolean(proj.title && proj.slug && proj.description && proj.content);
}
