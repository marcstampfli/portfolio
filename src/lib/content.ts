import "server-only";

import { cache } from "react";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import type { Experience, ProjectResponse, ProjectWithTechStack } from "@/types";
import { generatePeriodString } from "@/lib/date-utils";

const projectsRootDir = join(process.cwd(), "public", "projects");
const experiencesRootDir = join(process.cwd(), "public", "experiences");

const projectConfigSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  type: z.string().min(1),
  summary: z.string().default(""),
  content: z.string().optional().default(""),
  featured: z.boolean().optional().default(false),
  status: z.enum(["published", "draft", "unpublished", "archived"]).optional().default("published"),
  client: z.string().optional().nullable(),
  yearStart: z.number().int().optional().nullable(),
  year: z.number().int().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
  stack: z.array(z.string()).optional().default([]),
  cover: z.string().optional().nullable(),
  gallery: z.array(z.string()).optional().default([]),
  links: z
    .object({
      live: z.string().optional().default(""),
      github: z.string().optional().default(""),
      figma: z.string().optional().default(""),
    })
    .optional()
    .default({}),
});

const experienceConfigSchema = z.object({
  slug: z.string().min(1),
  title: z.string(),
  company: z.string(),
  position: z.string().optional().nullable(),
  location: z.string().nullable().optional(),
  employmentType: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  logoBackground: z.enum(["none", "light", "dark"]).optional().default("dark"),
  logoFit: z.enum(["contain", "cover"]).optional().default("contain"),
  logoWidth: z.number().int().min(12).max(40).nullable().optional(),
  logoHeight: z.number().int().min(12).max(40).nullable().optional(),
  logoPadding: z.number().int().min(0).max(12).nullable().optional(),
  summary: z.string(),
  techStack: z.array(z.string()),
  achievements: z.array(z.string()),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  sortOrder: z.number().int().optional().default(0),
});

type ProjectConfig = z.infer<typeof projectConfigSchema>;
type ExperienceConfig = z.infer<typeof experienceConfigSchema>;
type ExperienceWithOrder = Experience & { order: number; logo: string | null };

function toProjectAssetPath(projectSlug: string, fileName: string): string {
  return `/projects/${projectSlug}/${fileName}`;
}

function fileExists(projectSlug: string, fileName: string): boolean {
  return existsSync(join(projectsRootDir, projectSlug, fileName));
}

function experienceFileExists(experienceSlug: string, fileName: string): boolean {
  return existsSync(join(experiencesRootDir, experienceSlug, fileName));
}

function readOptionalTextFile(filePath: string): string {
  if (!existsSync(filePath)) {
    return "";
  }

  return readFileSync(filePath, "utf-8").trim();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInline(text: string): string {
  return escapeHtml(text).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

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
          .map((line) => `<li>${renderInline(line.slice(2).trim())}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      if (lines[0]?.startsWith("### ")) {
        return `<h3>${renderInline(lines[0].slice(4).trim())}</h3>`;
      }

      if (lines[0]?.startsWith("## ")) {
        return `<h2>${renderInline(lines[0].slice(3).trim())}</h2>`;
      }

      return `<p>${renderInline(lines.join(" "))}</p>`;
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
  return `/experiences/${experienceSlug}/${fileName}`;
}

function resolveExperienceLogo(experience: ExperienceConfig): string | null {
  if (!experience.logo) {
    return null;
  }

  if (experience.logo.startsWith("/")) {
    return experience.logo;
  }

  if (!experienceFileExists(experience.slug, experience.logo)) {
    return null;
  }

  return toExperienceAssetPath(experience.slug, experience.logo);
}

function readProjectConfig(projectDirName: string): ProjectWithTechStack | null {
  const projectDir = join(projectsRootDir, projectDirName);
  const configPath = join(projectDir, "project.json");

  if (!existsSync(configPath)) {
    return null;
  }

  const rawConfig = JSON.parse(readFileSync(configPath, "utf-8")) as unknown;
  const parsed = projectConfigSchema.safeParse(rawConfig);

  if (!parsed.success) {
    throw new Error(`Invalid project config for ${projectDirName}`);
  }

  const project = parsed.data;
  const bodyPath = join(projectDir, "body.md");
  const content = project.content || renderSimpleMarkdown(readOptionalTextFile(bodyPath));

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

export const getPublishedProjects = cache(async (): Promise<ProjectWithTechStack[]> => {
  if (!existsSync(projectsRootDir)) {
    return [];
  }

  const projectDirectories = readdirSync(projectsRootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !entry.name.startsWith(".") && !entry.name.startsWith("_"))
    .map((entry) => entry.name);

  return projectDirectories
    .map(readProjectConfig)
    .filter((project): project is ProjectWithTechStack => Boolean(project))
    .filter((project) => project.status === "published")
    .sort((a, b) => {
      // Featured first
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      // Featured projects: respect manual sort order
      if (a.featured && b.featured) {
        return a.order - b.order;
      }

      // Archive projects: newest year first, then manual order as tiebreaker
      const aYear = a.year ?? a.year_start ?? 0;
      const bYear = b.year ?? b.year_start ?? 0;
      if (bYear !== aYear) {
        return bYear - aYear;
      }

      return a.order - b.order;
    });
});

export const getExperiences = cache(async (): Promise<Experience[]> => {
  if (!existsSync(experiencesRootDir)) {
    return [];
  }

  const experienceDirectories = readdirSync(experiencesRootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !entry.name.startsWith(".") && !entry.name.startsWith("_"))
    .map((entry) => entry.name);

  return experienceDirectories
    .map((experienceDirName) => {
      const configPath = join(experiencesRootDir, experienceDirName, "experience.json");

      if (!existsSync(configPath)) {
        return null;
      }

      const rawConfig = JSON.parse(readFileSync(configPath, "utf-8")) as unknown;
      const parsed = experienceConfigSchema.safeParse(rawConfig);

      if (!parsed.success) {
        throw new Error(`Invalid experience config for ${experienceDirName}`);
      }

      const experience = parsed.data;

      const entry: ExperienceWithOrder = {
        id: experience.slug,
        title: experience.position || experience.title,
        company: experience.company,
        position: null,
        period: generatePeriodString(experience.startDate, experience.endDate ?? null),
        location: experience.location || null,
        type: experience.employmentType || null,
        logo: resolveExperienceLogo(experience) ?? null,
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
        created_at: undefined,
        updated_at: undefined,
        order: experience.sortOrder,
      };

      return entry;
    })
    .filter((experience): experience is ExperienceWithOrder => Boolean(experience))
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }

      return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    })
    .map(({ order: _order, ...experience }) => experience);
});

export function serializeProjectForApi(project: ProjectWithTechStack): ProjectResponse {
  return {
    ...project,
    tech_stack: project.tech_stack,
  };
}
