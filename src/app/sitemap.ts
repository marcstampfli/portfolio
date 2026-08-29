import type { MetadataRoute } from "next";
import { getPublishedProjectSlugs } from "@/lib/content";
import { isIndexableDeployment, siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexableDeployment) {
    return [];
  }

  const projectSlugs = await getPublishedProjectSlugs();

  return [
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: siteConfig.url + "/privacy",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...projectSlugs.map((slug) => ({
      url: siteConfig.url + "/projects/" + slug,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
