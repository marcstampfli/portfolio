import type { MetadataRoute } from "next";
import { isIndexableDeployment, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexableDeployment) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
