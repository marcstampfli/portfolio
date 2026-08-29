import { describe, expect, it } from "vitest";
import {
  getPublishedProjectBySlug,
  getPublishedProjectCards,
  getPublishedProjectSlugs,
} from "@/lib/content";

describe("content loader", () => {
  it("returns card data without case-study bodies", async () => {
    const projects = await getPublishedProjectCards();
    expect(projects.length).toBe(40);
    expect(projects.every((project) => !Object.hasOwn(project, "content"))).toBe(true);
    expect(projects.every((project) => project.images.length <= 1)).toBe(true);
  });

  it("only resolves published projects by slug", async () => {
    await expect(getPublishedProjectBySlug("steups-io")).resolves.toMatchObject({
      slug: "steups-io",
      status: "published",
    });
    await expect(getPublishedProjectBySlug("parlog")).resolves.toBeNull();
    await expect(getPublishedProjectBySlug("../parlog")).resolves.toBeNull();
  });

  it("exposes only published slugs for route generation", async () => {
    const slugs = await getPublishedProjectSlugs();
    expect(slugs).toHaveLength(40);
    expect(slugs).not.toContain("parlog");
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
