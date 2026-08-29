const DEFAULT_SITE_URL = "https://www.marcstampfli.com";

function normalizeSiteUrl(value?: string): string {
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEXT_PUBLIC_APP_URL is required in production");
    }

    return DEFAULT_SITE_URL;
  }

  try {
    const url = new URL(value);

    if ((url.protocol !== "https:" && url.protocol !== "http:") || url.username || url.password) {
      throw new Error("URL must use http(s) without credentials");
    }

    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return process.env.NODE_ENV === "production" ? DEFAULT_SITE_URL : url.origin;
    }

    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
      throw new Error("Production site URL must use https");
    }

    if (url.hostname === "marcstampfli.com") {
      return DEFAULT_SITE_URL;
    }

    return url.origin;
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Invalid NEXT_PUBLIC_APP_URL: " +
          (error instanceof Error ? error.message : "expected an absolute http(s) URL")
      );
    }

    return DEFAULT_SITE_URL;
  }
}

const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_APP_URL);
const isVercelDeployment = process.env.VERCEL === "1";
export const isIndexableDeployment = !isVercelDeployment || process.env.VERCEL_ENV === "production";

const email = "marcstampfli@gmail.com";

export const siteConfig = {
  name: "Marc Stämpfli",
  title: "Marc Stämpfli - Web Developer & Designer",
  description:
    "Web Developer and Designer based in Trinidad and Tobago. 15+ years building websites, WordPress solutions, and web apps - currently at WordHerd®.",
  url: siteUrl,
  ogImage: `${siteUrl}/profile.jpg`,
  location: "Trinidad and Tobago",
  email,
  mailto: `mailto:${email}?subject=${encodeURIComponent("New project - [brief description]")}&body=${encodeURIComponent("Hi Marc, I have a project I'd like to discuss...")}`,
  sameAs: [
    "https://github.com/marcstampfli",
    "https://www.linkedin.com/in/marc-st%C3%A4mpfli",
    "https://www.instagram.com/marcstampfli",
  ],
} as const;
