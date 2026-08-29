import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const contentProjectsRootDir = join(process.cwd(), "src", "content", "projects");
const contentExperiencesRootDir = join(process.cwd(), "src", "content", "experiences");
const projectAssetsRootDir = join(process.cwd(), "public", "projects");
const privateProjectAssetsRootDir = join(process.cwd(), "src", "private-project-assets");
const experienceAssetsRootDir = join(process.cwd(), "public", "experiences");
const validProjectStatuses = new Set(["published", "draft", "unpublished", "archived"]);
const validLogoBackgrounds = new Set(["none", "light", "dark"]);
const validLogoFits = new Set(["contain", "cover"]);
const maxSlugLength = 100;
const maxTitleLength = 160;
const maxTypeLength = 80;
const maxSummaryLength = 1000;
const maxProjectContentLength = 100000;
const maxTextArrayItems = 50;
const maxTextArrayItemLength = 500;
const maxUrlLength = 2048;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const projectImagePattern = /^[A-Za-z0-9._-]+\.(?:avif|gif|jpe?g|png|webp)$/i;
const experienceLogoPattern = /^[A-Za-z0-9._-]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i;
const issues = [];
const projectSlugs = new Set();
const experienceSlugs = new Set();

function addIssue(filePath, message) {
  issues.push(filePath + ": " + message);
}

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch (error) {
    addIssue(
      filePath,
      "invalid JSON (" + (error instanceof Error ? error.message : "unknown error") + ")"
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

function validateSlug(filePath, dirName, value, seenSlugs) {
  if (!isString(value) || value.length > maxSlugLength || !slugPattern.test(value)) {
    addIssue(filePath, "slug must be a lowercase kebab-case string");
    return false;
  }

  if (value !== dirName) {
    addIssue(filePath, 'slug "' + value + '" must match directory name "' + dirName + '"');
  }

  if (seenSlugs.has(value)) {
    addIssue(filePath, 'duplicate slug "' + value + '"');
  }
  seenSlugs.add(value);
  return true;
}

function validateOptionalHttpsUrl(filePath, fieldName, value) {
  if (value === undefined || value === "") {
    return;
  }

  if (!isString(value) || value.length > maxUrlLength) {
    addIssue(filePath, fieldName + " must be a string");
    return;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) {
      addIssue(filePath, fieldName + " must use https without credentials");
    }
  } catch {
    addIssue(filePath, fieldName + " must be a valid URL");
  }
}

function isValidDate(value) {
  if (!isString(value) || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(value + "T00:00:00Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validateDate(filePath, fieldName, value, required) {
  if (value === undefined || value === null || value === "") {
    if (required) {
      addIssue(filePath, fieldName + " is required");
    }
    return false;
  }

  if (!isValidDate(value)) {
    addIssue(filePath, fieldName + " must use a valid YYYY-MM-DD date");
    return false;
  }
  return true;
}

function validateAsset(filePath, assetsRoot, ownerDir, fieldName, value, pattern) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  if (!isString(value) || !pattern.test(value)) {
    addIssue(filePath, fieldName + " has an invalid filename");
    return;
  }

  const roots = Array.isArray(assetsRoot) ? assetsRoot : [assetsRoot];
  if (!roots.some((root) => existsSync(join(root, ownerDir, value)))) {
    addIssue(filePath, fieldName + ' references missing file "' + value + '"');
  }
}

function validateStringArray(
  filePath,
  fieldName,
  value,
  { maxItems = maxTextArrayItems, maxItemLength = maxTextArrayItemLength } = {}
) {
  if (!Array.isArray(value)) {
    addIssue(filePath, fieldName + " must be an array");
    return;
  }

  if (value.length > maxItems) {
    addIssue(filePath, fieldName + " must contain no more than " + maxItems + " items");
  }

  value.forEach((item, index) => {
    if (!isString(item) || item.trim().length === 0 || item.length > maxItemLength) {
      addIssue(filePath, fieldName + "[" + index + "] must be a non-empty string");
    }
  });
}

function validateOptionalBody(filePath, bodyPath) {
  if (!existsSync(bodyPath)) {
    return;
  }

  try {
    const content = readFileSync(bodyPath, "utf8");
    if (content.length > maxProjectContentLength) {
      addIssue(
        filePath,
        "body.md must contain no more than " + maxProjectContentLength + " characters"
      );
    }
  } catch (error) {
    addIssue(
      bodyPath,
      "unable to read body.md (" + (error instanceof Error ? error.message : "unknown error") + ")"
    );
  }
}

function validatePublicAssetDirectories() {
  for (const [assetsRoot, metadataFile, bodyFile] of [
    [projectAssetsRootDir, "project.json", "body.md"],
    [experienceAssetsRootDir, "experience.json", null],
  ]) {
    if (!existsSync(assetsRoot)) {
      continue;
    }

    for (const entry of readdirSync(assetsRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }

      const assetDir = join(assetsRoot, entry.name);
      if (existsSync(join(assetDir, metadataFile))) {
        addIssue(join(assetDir, metadataFile), "metadata must live under src/content, not public");
      }
      if (bodyFile && existsSync(join(assetDir, bodyFile))) {
        addIssue(
          join(assetDir, bodyFile),
          "case-study content must live under src/content, not public"
        );
      }
    }
  }
}

function validateProjects() {
  if (!existsSync(contentProjectsRootDir)) {
    addIssue(contentProjectsRootDir, "directory is missing");
    return;
  }

  for (const entry of readdirSync(contentProjectsRootDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".") || entry.name.startsWith("_")) {
      continue;
    }

    const projectDir = join(contentProjectsRootDir, entry.name);
    const filePath = join(projectDir, "project.json");
    const project = readJson(filePath);

    if (!project) {
      continue;
    }

    validateSlug(filePath, entry.name, project.slug, projectSlugs);

    if (!isString(project.title) || project.title.trim().length === 0) {
      addIssue(filePath, "title is required");
    } else if (project.title.length > maxTitleLength) {
      addIssue(filePath, "title is too long");
    }

    if (!isString(project.type) || project.type.trim().length === 0) {
      addIssue(filePath, "type is required");
    } else if (project.type.length > maxTypeLength) {
      addIssue(filePath, "type is too long");
    }

    if (
      project.summary !== undefined &&
      (!isString(project.summary) || project.summary.length > maxSummaryLength)
    ) {
      addIssue(
        filePath,
        "summary must be a string of no more than " + maxSummaryLength + " characters"
      );
    }

    if (
      project.content !== undefined &&
      (!isString(project.content) || project.content.length > maxProjectContentLength)
    ) {
      addIssue(
        filePath,
        "content must be a string of no more than " + maxProjectContentLength + " characters"
      );
    }

    validateOptionalBody(filePath, join(projectDir, "body.md"));

    if (!isString(project.status) || !validProjectStatuses.has(project.status)) {
      addIssue(filePath, "status must be explicitly set to a valid value");
    }

    const projectAssetRoots =
      project.status === "published"
        ? [projectAssetsRootDir]
        : [projectAssetsRootDir, privateProjectAssetsRootDir];

    if (
      project.yearStart !== undefined &&
      project.yearStart !== null &&
      (!isNumber(project.yearStart) || project.yearStart < 1900 || project.yearStart > 2200)
    ) {
      addIssue(filePath, "yearStart must be an integer between 1900 and 2200 or null");
    }

    if (
      project.year !== undefined &&
      project.year !== null &&
      (!isNumber(project.year) || project.year < 1900 || project.year > 2200)
    ) {
      addIssue(filePath, "year must be an integer between 1900 and 2200 or null");
    }

    if (isNumber(project.yearStart) && isNumber(project.year) && project.yearStart > project.year) {
      addIssue(filePath, "yearStart must be less than or equal to year");
    }

    validateAsset(
      filePath,
      projectAssetRoots,
      entry.name,
      "cover",
      project.cover,
      projectImagePattern
    );

    if (project.gallery !== undefined) {
      if (!Array.isArray(project.gallery)) {
        addIssue(filePath, "gallery must be an array");
      } else {
        if (project.gallery.length > maxTextArrayItems) {
          addIssue(filePath, "gallery must contain no more than " + maxTextArrayItems + " items");
        }
        project.gallery.forEach((image, index) => {
          validateAsset(
            filePath,
            projectAssetRoots,
            entry.name,
            "gallery[" + index + "]",
            image,
            projectImagePattern
          );
        });
      }
    }

    if (project.stack !== undefined) {
      validateStringArray(filePath, "stack", project.stack, { maxItemLength: 200 });
    }

    const { links } = project;
    if (
      links !== undefined &&
      (links === null || typeof links !== "object" || Array.isArray(links))
    ) {
      addIssue(filePath, "links must be an object");
    } else if (links) {
      validateOptionalHttpsUrl(filePath, "links.live", links.live);
      validateOptionalHttpsUrl(filePath, "links.github", links.github);
      validateOptionalHttpsUrl(filePath, "links.figma", links.figma);
    }
  }
}

function validateExperiences() {
  if (!existsSync(contentExperiencesRootDir)) {
    addIssue(contentExperiencesRootDir, "directory is missing");
    return;
  }

  for (const entry of readdirSync(contentExperiencesRootDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".") || entry.name.startsWith("_")) {
      continue;
    }

    const experienceDir = join(contentExperiencesRootDir, entry.name);
    const filePath = join(experienceDir, "experience.json");
    const experience = readJson(filePath);

    if (!experience) {
      continue;
    }

    validateSlug(filePath, entry.name, experience.slug, experienceSlugs);

    if (!isString(experience.title) || experience.title.trim().length === 0) {
      addIssue(filePath, "title is required");
    } else if (experience.title.length > maxTitleLength) {
      addIssue(filePath, "title is too long");
    }

    if (!isString(experience.company) || experience.company.trim().length === 0) {
      addIssue(filePath, "company is required");
    } else if (experience.company.length > maxTitleLength) {
      addIssue(filePath, "company is too long");
    }

    if (!isString(experience.summary) || experience.summary.trim().length === 0) {
      addIssue(filePath, "summary is required");
    } else if (experience.summary.length > maxSummaryLength) {
      addIssue(filePath, "summary is too long");
    }

    validateStringArray(filePath, "techStack", experience.techStack, { maxItemLength: 200 });
    validateStringArray(filePath, "achievements", experience.achievements);

    const startDateValid = validateDate(filePath, "startDate", experience.startDate, true);
    const endDateValid =
      experience.endDate === null || experience.endDate === undefined
        ? true
        : validateDate(filePath, "endDate", experience.endDate, false);
    if (
      startDateValid &&
      endDateValid &&
      experience.endDate &&
      experience.endDate < experience.startDate
    ) {
      addIssue(filePath, "endDate must be on or after startDate");
    }

    validateAsset(
      filePath,
      experienceAssetsRootDir,
      entry.name,
      "logo",
      experience.logo,
      experienceLogoPattern
    );

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

validatePublicAssetDirectories();
validateProjects();
validateExperiences();

if (issues.length > 0) {
  console.error("Content validation failed with " + issues.length + " issue(s):");
  for (const issue of issues) {
    console.error("- " + issue);
  }
  process.exit(1);
}

console.warn("Content validation passed.");
