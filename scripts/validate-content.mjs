import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const projectsRootDir = join(process.cwd(), "public", "projects");
const experiencesRootDir = join(process.cwd(), "public", "experiences");
const validProjectStatuses = new Set(["published", "draft", "unpublished", "archived"]);
const validLogoBackgrounds = new Set(["none", "light", "dark"]);
const validLogoFits = new Set(["contain", "cover"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const projectImagePattern = /^[A-Za-z0-9._-]+\.(?:avif|gif|jpe?g|png|webp)$/i;
const experienceLogoPattern = /^[A-Za-z0-9._/-]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i;

const issues = [];

function addIssue(filePath, message) {
  issues.push(`${filePath}: ${message}`);
}

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch (error) {
    addIssue(
      filePath,
      `invalid JSON (${error instanceof Error ? error.message : "unknown error"})`
    );
    return null;
  }
}

function isString(value) {
  return typeof value === "string";
}

function isNumber(value) {
  return typeof value === "number" && Number.isInteger(value);
}

function validateSlug(filePath, dirName, value) {
  if (!isString(value) || !slugPattern.test(value)) {
    addIssue(filePath, "slug must be a lowercase kebab-case string");
    return;
  }

  if (value !== dirName) {
    addIssue(filePath, `slug "${value}" must match directory name "${dirName}"`);
  }
}

function validateOptionalHttpUrl(filePath, fieldName, value) {
  if (value === undefined || value === "") {
    return;
  }

  if (!isString(value)) {
    addIssue(filePath, `${fieldName} must be a string`);
    return;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      addIssue(filePath, `${fieldName} must use http(s)`);
    }
  } catch {
    addIssue(filePath, `${fieldName} must be a valid URL`);
  }
}

function validateDate(filePath, fieldName, value, required) {
  if (value === undefined || value === null || value === "") {
    if (required) {
      addIssue(filePath, `${fieldName} is required`);
    }
    return;
  }

  if (!isString(value) || Number.isNaN(new Date(value).getTime())) {
    addIssue(filePath, `${fieldName} must be a valid date string`);
  }
}

function validateAsset(filePath, projectDir, fieldName, value, pattern) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  if (!isString(value) || !pattern.test(value)) {
    addIssue(filePath, `${fieldName} has an invalid filename`);
    return;
  }

  if (value.startsWith("/")) {
    return;
  }

  if (!existsSync(join(projectDir, value))) {
    addIssue(filePath, `${fieldName} references missing file "${value}"`);
  }
}

function validateProjects() {
  if (!existsSync(projectsRootDir)) {
    addIssue(projectsRootDir, "directory is missing");
    return;
  }

  for (const entry of readdirSync(projectsRootDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".") || entry.name.startsWith("_")) {
      continue;
    }

    const projectDir = join(projectsRootDir, entry.name);
    const filePath = join(projectDir, "project.json");
    const project = readJson(filePath);

    if (!project) {
      continue;
    }

    validateSlug(filePath, entry.name, project.slug);

    if (!isString(project.title) || project.title.length === 0) {
      addIssue(filePath, "title is required");
    }

    if (!isString(project.type) || project.type.length === 0) {
      addIssue(filePath, "type is required");
    }

    if (
      project.status !== undefined &&
      (!isString(project.status) || !validProjectStatuses.has(project.status))
    ) {
      addIssue(filePath, "status is invalid");
    }

    if (
      project.yearStart !== undefined &&
      project.yearStart !== null &&
      !isNumber(project.yearStart)
    ) {
      addIssue(filePath, "yearStart must be an integer or null");
    }

    if (project.year !== undefined && project.year !== null && !isNumber(project.year)) {
      addIssue(filePath, "year must be an integer or null");
    }

    if (isNumber(project.yearStart) && isNumber(project.year) && project.yearStart > project.year) {
      addIssue(filePath, "yearStart must be less than or equal to year");
    }

    validateAsset(filePath, projectDir, "cover", project.cover, projectImagePattern);

    if (project.gallery !== undefined) {
      if (!Array.isArray(project.gallery)) {
        addIssue(filePath, "gallery must be an array");
      } else {
        project.gallery.forEach((image, index) => {
          validateAsset(filePath, projectDir, `gallery[${index}]`, image, projectImagePattern);
        });
      }
    }

    const { links } = project;
    if (
      links !== undefined &&
      (links === null || typeof links !== "object" || Array.isArray(links))
    ) {
      addIssue(filePath, "links must be an object");
    } else if (links) {
      validateOptionalHttpUrl(filePath, "links.live", links.live);
      validateOptionalHttpUrl(filePath, "links.github", links.github);
      validateOptionalHttpUrl(filePath, "links.figma", links.figma);
    }
  }
}

function validateExperiences() {
  if (!existsSync(experiencesRootDir)) {
    addIssue(experiencesRootDir, "directory is missing");
    return;
  }

  for (const entry of readdirSync(experiencesRootDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".") || entry.name.startsWith("_")) {
      continue;
    }

    const experienceDir = join(experiencesRootDir, entry.name);
    const filePath = join(experienceDir, "experience.json");
    const experience = readJson(filePath);

    if (!experience) {
      continue;
    }

    validateSlug(filePath, entry.name, experience.slug);

    if (!isString(experience.title) || experience.title.length === 0) {
      addIssue(filePath, "title is required");
    }

    if (!isString(experience.company) || experience.company.length === 0) {
      addIssue(filePath, "company is required");
    }

    if (!isString(experience.summary) || experience.summary.length === 0) {
      addIssue(filePath, "summary is required");
    }

    if (!Array.isArray(experience.techStack)) {
      addIssue(filePath, "techStack must be an array");
    }

    if (!Array.isArray(experience.achievements)) {
      addIssue(filePath, "achievements must be an array");
    }

    validateDate(filePath, "startDate", experience.startDate, true);
    validateDate(filePath, "endDate", experience.endDate, false);
    validateAsset(filePath, experienceDir, "logo", experience.logo, experienceLogoPattern);

    if (
      experience.logoBackground !== undefined &&
      (!isString(experience.logoBackground) || !validLogoBackgrounds.has(experience.logoBackground))
    ) {
      addIssue(filePath, "logoBackground is invalid");
    }

    if (
      experience.logoFit !== undefined &&
      (!isString(experience.logoFit) || !validLogoFits.has(experience.logoFit))
    ) {
      addIssue(filePath, "logoFit is invalid");
    }
  }
}

validateProjects();
validateExperiences();

if (issues.length > 0) {
  console.error(`Content validation failed with ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.warn("Content validation passed.");
