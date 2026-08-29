import { expect, test, type Page } from "@playwright/test";

function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test("published project pages are crawlable and unpublished content stays private", async ({
  page,
  request,
}) => {
  const pageErrors = collectPageErrors(page);
  const homeResponse = await page.goto("/");

  expect(homeResponse?.ok()).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Web Developer & Designer");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/$/);

  const projectLink = page.locator('a[href="/projects/steups-io"]').first();
  await expect(projectLink).toBeVisible();
  const projectResponse = await page.goto("/projects/steups-io");
  expect(projectResponse?.ok()).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("steups.io");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/projects\/steups-io$/
  );
  const contentSecurityPolicy = projectResponse?.headers()["content-security-policy"] ?? "";
  expect(contentSecurityPolicy).toContain("script-src");
  expect(contentSecurityPolicy).not.toContain("upgrade-insecure-requests");
  expect(projectResponse?.headers()["cache-control"] ?? "").not.toContain("public");
  const jsonLdNonces = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) => scripts.map((script) => script.getAttribute("nonce")));
  expect(jsonLdNonces.length).toBeGreaterThanOrEqual(2);
  for (const nonce of jsonLdNonces) {
    expect(nonce).toBeTruthy();
    expect(contentSecurityPolicy).toContain("'nonce-" + nonce + "'");
  }

  for (const path of [
    "/projects/parlog/project.json",
    "/projects/parlog/body.md",
    "/projects/parlog/project-parlog.jpg",
    "/projects/amazon-clone/project.json",
    "/projects/parlog",
  ]) {
    await expect((await request.get(path)).status()).toBe(404);
  }

  const optimizedDraftImage = await request.get(
    "/_next/image?url=" + encodeURIComponent("/projects/parlog/project-parlog.jpg") + "&w=640&q=75"
  );
  expect(optimizedDraftImage.status()).toBe(404);
  expect((await request.get("/projects/steups-io/project-steups.jpg")).status()).toBe(200);

  const sitemap = await request.get("/sitemap.xml");
  const sitemapText = await sitemap.text();
  expect(sitemap.status()).toBe(200);
  expect(sitemapText).toContain("/projects/steups-io");
  expect(sitemapText).not.toContain("/projects/parlog");

  expect(pageErrors).toEqual([]);
});

test("mobile navigation, forms, and semantic controls remain usable", async ({ page }) => {
  const pageErrors = collectPageErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const openNavigation = page.getByRole("button", { name: "Open navigation" });
  await expect(openNavigation).toBeVisible();
  await openNavigation.click();
  await expect(page.getByRole("button", { name: "Close navigation" })).toBeVisible();
  await expect(page.locator("#mobile-nav")).toBeVisible();

  const mobileProjectsLink = page
    .locator("#mobile-nav")
    .getByRole("link", { name: "Projects", exact: true });
  await mobileProjectsLink.click();
  await expect(page).toHaveURL(/#projects$/);

  const audit = await page.evaluate(() => ({
    mainCount: document.querySelectorAll("main").length,
    emptyImageAltCount: Array.from(document.images).filter((image) => !image.alt.trim()).length,
    unsafeBlankTargetCount: Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')
    ).filter((link) => !link.rel.includes("noopener") || !link.rel.includes("noreferrer")).length,
    unnamedButtonCount: Array.from(document.querySelectorAll("button")).filter(
      (button) => !button.textContent?.trim() && !button.getAttribute("aria-label")
    ).length,
    unlabeledFormControlCount: Array.from(
      document.querySelectorAll("input, textarea, select")
    ).filter((control) => {
      const id = control.getAttribute("id");
      return !id || !document.querySelector(`label[for="${CSS.escape(id)}"]`);
    }).length,
  }));

  expect(audit).toEqual({
    mainCount: 1,
    emptyImageAltCount: 0,
    unsafeBlankTargetCount: 0,
    unnamedButtonCount: 0,
    unlabeledFormControlCount: 0,
  });

  const nameInput = page.locator('input[name="name"]');
  await nameInput.fill("A");
  expect(
    await nameInput.evaluate((element) => !(element as HTMLInputElement).checkValidity())
  ).toBe(true);
  await expect(page.locator('form[action="/api/contact"]')).toHaveAttribute("method", "post");
  const themeToggle = page.getByRole("button", { name: /Switch to (light|dark) theme/ });
  await expect(themeToggle).toBeVisible();
  expect(["true", "false"]).toContain(await themeToggle.getAttribute("aria-pressed"));

  expect(pageErrors).toEqual([]);
});
