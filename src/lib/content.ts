import "server-only";

import { unstable_cache } from "next/cache";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import type { Experience, ProjectCard, ProjectWithTechStack } from "@/types";
import { generatePeriodString } from "@/lib/date-utils";
import { escapeHtml } from "@/lib/html";

const contentProjectsRootDir = join(process.cwd(), "src", "content", "projects");
const contentExperiencesRootDir = join(process.cwd(), "src", "content", "experiences");
const projectAssetsRootDir = join(process.cwd(), "public", "projects");
const experienceAssetsRootDir = join(process.cwd(), "public", "experiences");
const isProduction = process.env.NODE_ENV === "production";
const MAX_SLUG_LENGTH = 100;
const MAX_PROJECT_TITLE_LENGTH = 160;
const MAX_PROJECT_TYPE_LENGTH = 80;
const MAX_PROJECT_SUMMARY_LENGTH = 1_000;
const MAX_PROJECT_CONTENT_LENGTH = 100_000;
const MAX_TEXT_ARRAY_ITEMS = 50;
const MAX_TEXT_ARRAY_ITEM_LENGTH = 500;
const MAX_URL_LENGTH = 2_048;

const slugSchema = z
  .string()
  .max(MAX_SLUG_LENGTH, "Slug is too long")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug");
const projectImageSchema = z
  .string()
  .regex(/^[A-Za-z0-9._-]+\.(?:avif|gif|jpe?g|png|webp)$/i, "Invalid image filename");
const experienceLogoSchema = z
  .string()
  .regex(/^[A-Za-z0-9._-]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i, "Invalid logo filename");
const optionalProjectImageSchema = z.preprocess(
  (value) => (value === "" ? null : value),
  projectImageSchema.optional().nullable()
);
const optionalExperienceLogoSchema = z.preprocess(
  (value) => (value === "" ? null : value),
  experienceLogoSchema.optional().nullable()
);
const optionalUrlSchema = z
  .string()
  .max(MAX_URL_LENGTH, "URL is too long")
  .trim()
  .refine((value) => {
    if (!value) {
      return true;
    }

    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch {
      return false;
    }
  }, "URL must be empty or use https without credentials");
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD")
  .refine((value) => {
    const date = new Date(value + "T00:00:00Z");
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Invalid date");
const textArraySchema = z
  .array(z.string().trim().min(1).max(MAX_TEXT_ARRAY_ITEM_LENGTH))
  .max(MAX_TEXT_ARRAY_ITEMS);

const projectConfigSchema = z
  .object({
    title: z.string().trim().min(1).max(MAX_PROJECT_TITLE_LENGTH),
    slug: slugSchema,
    type: z.string().trim().min(1).max(MAX_PROJECT_TYPE_LENGTH),
    summary: z.string().trim().max(MAX_PROJECT_SUMMARY_LENGTH).default(""),
    content: z.string().max(MAX_PROJECT_CONTENT_LENGTH).optional().default(""),
    featured: z.boolean().optional().default(false),
    status: z.enum(["published", "draft", "unpublished", "archived"]).optional().default("draft"),
    client: z.string().trim().max(MAX_PROJECT_TITLE_LENGTH).optional().nullable(),
    yearStart: z.number().int().min(1900).max(2200).optional().nullable(),
    year: z.number().int().min(1900).max(2200).optional().nullable(),
    sortOrder: z.number().int().optional().default(0),
    stack: textArraySchema.optional().default([]),
    cover: optionalProjectImageSchema,
    gallery: z.array(projectImageSchema).max(MAX_TEXT_ARRAY_ITEMS).optional().default([]),
    links: z
      .object({
        live: optionalUrlSchema.optional().default(""),
        github: optionalUrlSchema.optional().default(""),
        figma: optionalUrlSchema.optional().default(""),
      })
      .optional()
      .default({}),
  })
  .refine((project) => !project.yearStart || !project.year || project.yearStart <= project.year, {
    message: "yearStart must be less than or equal to year",
    path: ["yearStart"],
  });

const experienceConfigSchema = z
  .object({
    slug: slugSchema,
    title: z.string().trim().min(1).max(MAX_PROJECT_TITLE_LENGTH),
    company: z.string().trim().min(1).max(MAX_PROJECT_TITLE_LENGTH),
    position: z.string().trim().max(MAX_PROJECT_TITLE_LENGTH).optional().nullable(),
    location: z.string().trim().max(MAX_PROJECT_TITLE_LENGTH).nullable().optional(),
    employmentType: z.string().trim().max(MAX_PROJECT_TITLE_LENGTH).nullable().optional(),
    logo: optionalExperienceLogoSchema,
    logoBackground: z.enum(["none", "light", "dark"]).optional().default("dark"),
    logoFit: z.enum(["contain", "cover"]).optional().default("contain"),
    logoWidth: z.number().int().min(12).max(40).nullable().optional(),
    logoHeight: z.number().int().min(12).max(40).nullable().optional(),
    logoPadding: z.number().int().min(0).max(12).nullable().optional(),
    summary: z.string().trim().min(1).max(MAX_PROJECT_SUMMARY_LENGTH),
    techStack: textArraySchema,
    achievements: textArraySchema,
    startDate: dateSchema,
    endDate: dateSchema.nullable().optional(),
    sortOrder: z.number().int().optional().default(0),
  })
  .refine((experience) => !experience.endDate || experience.endDate >= experience.startDate, {
    message: "endDate must be on or after startDate",
    path: ["endDate"],
  });

type ProjectConfig = z.infer<typeof projectConfigSchema>;
type ExperienceConfig = z.infer<typeof experienceConfigSchema>;
type ExperienceWithOrder = Experience & { order: number; logo: string | null };

function toProjectAssetPath(projectSlug: string, fileName: string): string {
  return "/projects/" + projectSlug + "/" + fileName;
}

function fileExists(projectSlug: string, fileName: string): boolean {
  return existsSync(join(projectAssetsRootDir, projectSlug, fileName));
}

function experienceFileExists(experienceSlug: string, fileName: string): boolean {
  return existsSync(join(experienceAssetsRootDir, experienceSlug, fileName));
}

function readOptionalTextFile(filePath: string): string {
  if (!existsSync(filePath)) {
    return "";
  }

  const content = readFileSync(filePath, "utf-8");
  if (content.length > MAX_PROJECT_CONTENT_LENGTH) {
    throw new Error("Case-study content is too long: " + filePath);
  }

  return content.trim();
}

function renderInline(text: string): string {
  return escapeHtml(text).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

// Case studies intentionally use a small, escaped Markdown subset: paragraphs,
// unordered lists, h2/h3 headings, and bold text. Add a real Markdown parser
// only if content requirements expand beyond this safe subset.
function renderSimpleMarkdown(markdown: string): string {
  const blocks = markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.every((line) => line.startsWith("- "))) {
        const items = lines
          .map((line) => "<li>" + renderInline(line.slice(2).trim()) + "</li>")
          .join("");
        return "<ul>" + items + "</ul>";
      }

      if (lines[0]?.startsWith("### ")) {
        return "<h3>" + renderInline(lines[0].slice(4).trim()) + "</h3>";
      }

      if (lines[0]?.startsWith("## ")) {
        return "<h2>" + renderInline(lines[0].slice(3).trim()) + "</h2>";
      }

      return "<p>" + renderInline(lines.join(" ")) + "</p>";
    })
    .join("\n");
}

function normalizeProjectImages(project: ProjectConfig): string[] {
  const gallery = project.gallery.filter((fileName) => fileExists(project.slug, fileName));
  const cover = project.cover && fileExists(project.slug, project.cover) ? [project.cover] : [];

  return [...new Set([...cover, ...gallery])].map((fileName) =>
    toProjectAssetPath(project.slug, fileName)
  );
}

function toExperienceAssetPath(experienceSlug: string, fileName: string): string {
  return "/experiences/" + experienceSlug + "/" + fileName;
}

function resolveExperienceLogo(experience: ExperienceConfig): string | null {
  if (!experience.logo || !experienceFileExists(experience.slug, experience.logo)) {
    return null;
  }

  return toExperienceAssetPath(experience.slug, experience.logo);
}

function parseJsonFile(filePath: string, label: string): unknown {
  try {
    return JSON.parse(readFileSync(filePath, "utf-8")) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    throw new Error("Unable to read " + label + ": " + message);
  }
}

function readProjectConfig(
  projectDirName: string,
  includeContent: boolean
): ProjectWithTechStack | null {
  const projectDir = join(contentProjectsRootDir, projectDirName);
  const configPath = join(projectDir, "project.json");

  if (!existsSync(configPath)) {
    return null;
  }

  const parsed = projectConfigSchema.safeParse(
    parseJsonFile(configPath, "project config for " + projectDirName)
  );

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => (issue.path.join(".") || "root") + ": " + issue.message)
      .join("; ");

    throw new Error("Invalid project config for " + projectDirName + ": " + details);
  }

  const project = parsed.data;
  if (project.slug !== projectDirName) {
    throw new Error("Project slug mismatch for " + projectDirName + ": expected " + projectDirName);
  }

  const bodyPath = join(projectDir, "body.md");
  const content = includeContent
    ? renderSimpleMarkdown(project.content.trim() || readOptionalTextFile(bodyPath))
    : "";

  return {
    id: project.slug,
    title: project.title,
    slug: project.slug,
    description: project.summary,
    content,
    project_type: project.type,
    featured: project.featured,
    tech_stack: project.stack,
    images: normalizeProjectImages(project),
    live_url: project.links.live || null,
    github_url: project.links.github || null,
    figma_url: project.links.figma || null,
    client: project.client || null,
    status: project.status,
    order: project.sortOrder,
    year_start: project.yearStart ?? null,
    year: project.year ?? null,
  };
}

function getContentDirectories(rootDir: string): string[] {
  if (!existsSync(rootDir)) {
    return [];
  }

  return readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !entry.name.startsWith(".") && !entry.name.startsWith("_"))
    .map((entry) => entry.name);
}

function sortProjects(projects: ProjectWithTechStack[]): ProjectWithTechStack[] {
  return projects.sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    if (a.featured && b.featured) {
      return a.order - b.order;
    }

    const aYear = a.year ?? a.year_start ?? 0;
    const bYear = b.year ?? b.year_start ?? 0;
    if (bYear !== aYear) {
      return bYear - aYear;
    }

    return a.order - b.order;
  });
}

function loadPublishedProjects(includeContent: boolean): ProjectWithTechStack[] {
  return sortProjects(
    getContentDirectories(contentProjectsRootDir)
      .map((projectDirName) => readProjectConfig(projectDirName, includeContent))
      .filter((project): project is ProjectWithTechStack => Boolean(project))
      .filter((project) => project.status === "published")
  );
}

function loadPublishedProjectBySlug(
  slug: string,
  includeContent: boolean
): ProjectWithTechStack | null {
  const project = readProjectConfig(slug, includeContent);
  return project?.status === "published" ? project : null;
}

const loadPublishedProjectCardsCached = unstable_cache(
  async () => loadPublishedProjects(false),
  ["published-project-cards"],
  { revalidate: 3600 }
);

const loadExperiences = (): Experience[] => {
  return getContentDirectories(contentExperiencesRootDir)
    .map((experienceDirName) => {
      const configPath = join(contentExperiencesRootDir, experienceDirName, "experience.json");

      if (!existsSync(configPath)) {
        return null;
      }

      const parsed = experienceConfigSchema.safeParse(
        parseJsonFile(configPath, "experience config for " + experienceDirName)
      );

      if (!parsed.success) {
        const details = parsed.error.issues
          .map((issue) => (issue.path.join(".") || "root") + ": " + issue.message)
          .join("; ");
        throw new Error("Invalid experience config for " + experienceDirName + ": " + details);
      }

      const experience = parsed.data;
      if (experience.slug !== experienceDirName) {
        throw new Error(
          "Experience slug mismatch for " + experienceDirName + ": expected " + experienceDirName
        );
      }

      const entry: ExperienceWithOrder = {
        id: experience.slug,
        title: experience.title,
        company: experience.company,
        position: experience.position ?? null,
        period: generatePeriodString(experience.startDate, experience.endDate ?? null),
        location: experience.location || null,
        type: experience.employmentType || null,
        logo: resolveExperienceLogo(experience),
        logo_background: experience.logoBackground,
        logo_fit: experience.logoFit,
        logo_width: experience.logoWidth ?? null,
        logo_height: experience.logoHeight ?? null,
        logo_padding: experience.logoPadding ?? null,
        start_date: experience.startDate,
        end_date: experience.endDate ?? null,
        description: experience.summary,
        tech_stack: experience.techStack,
        achievements: experience.achievements,
        order: experience.sortOrder,
      };

      return entry;
    })
    .filter((experience): experience is ExperienceWithOrder => Boolean(experience))
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }

      return (
        new Date(b.start_date + "T00:00:00Z").getTime() -
        new Date(a.start_date + "T00:00:00Z").getTime()
      );
    })
    .map(({ order: _order, ...experience }) => experience);
};

const loadExperiencesCached = unstable_cache(async () => loadExperiences(), ["experiences"], {
  revalidate: 3600,
});

export async function getPublishedProjectCards(): Promise<ProjectCard[]> {
  const projects = isProduction
    ? await loadPublishedProjectCardsCached()
    : loadPublishedProjects(false);

  return projects.map(({ content: _content, ...project }) => ({
    ...project,
    images: project.images.slice(0, 1),
  }));
}

export async function getPublishedProjectBySlug(
  slug: string
): Promise<ProjectWithTechStack | null> {
  const parsedSlug = slugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    return null;
  }

  if (isProduction) {
    return unstable_cache(
      async () => loadPublishedProjectBySlug(parsedSlug.data, true),
      ["published-project-by-slug", parsedSlug.data],
      { revalidate: 3600 }
    )();
  }

  return loadPublishedProjectBySlug(parsedSlug.data, true);
}

export async function getPublishedProjectSlugs(): Promise<string[]> {
  const projects = await getPublishedProjectCards();
  return projects.map((project) => project.slug);
}

export async function getExperiences(): Promise<Experience[]> {
  return isProduction ? await loadExperiencesCached() : loadExperiences();
}
