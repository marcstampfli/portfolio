const DEFAULT_SITE_URL = "https://www.marcstampfli.com";

function normalizeSiteUrl(value?: string): string {
  if (!value) {
    return DEFAULT_SITE_URL;
  }

  try {
    const url = new URL(value);

    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return DEFAULT_SITE_URL;
    }

    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_APP_URL);

export const siteConfig = {
  name: "Marc Stämpfli",
  title: "Marc Stämpfli - Web Developer & Designer",
  description:
    "Web Developer and Designer based in Trinidad and Tobago. 15+ years building websites, WordPress solutions, and web apps — currently at WordHerd®.",
  url: siteUrl,
  ogImage: `${siteUrl}/profile.jpg`,
  location: "Trinidad and Tobago",
  email: "marcstampfli@gmail.com",
  sameAs: [
    "https://github.com/marcstampfli",
    "https://www.linkedin.com/in/marc-st%C3%A4mpfli",
    "https://www.instagram.com/marcstampfli",
  ],
} as const;
