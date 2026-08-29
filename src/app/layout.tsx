import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@/components/shared/analytics";
import { AnalyticsConsent } from "@/components/shared/analytics-consent";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { FloatingNav } from "@/components/shared/floating-nav";
import { SkipToContent } from "@/components/shared/skip-to-content";
import { isIndexableDeployment, siteConfig } from "@/lib/site";
import { serializeJsonLd } from "@/lib/json-ld";

const isProduction = process.env.NODE_ENV === "production";
const isVercelProduction =
  isProduction && process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
const hasValidGaMeasurementId = /^G-[A-Z0-9]+$/i.test(gaMeasurementId);
const analyticsEnabled = isProduction && (hasValidGaMeasurementId || isVercelProduction);
const themeBootstrapScript = `
  (() => {
    try {
      const stored = localStorage.getItem("theme");
      const theme = stored === "light" || stored === "dark"
        ? stored
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.style.colorScheme = theme;
    } catch {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    }
  })();
`;

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edf3f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1018" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: "%s | Marc Stämpfli",
  },
  description: siteConfig.description,
  authors: [{ name: "Marc Stämpfli" }],
  creator: "Marc Stämpfli",
  applicationName: "Marc Stämpfli Portfolio",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: isIndexableDeployment,
    follow: isIndexableDeployment,
    googleBot: {
      index: isIndexableDeployment,
      follow: isIndexableDeployment,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_TT",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: "Marc Stämpfli Portfolio",
    images: [
      {
        url: siteConfig.ogImage,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marc Stämpfli",
  jobTitle: "Web Developer & Designer",
  description: siteConfig.description,
  url: siteConfig.url,
  sameAs: siteConfig.sameAs,
  knowsAbout: [
    "WordPress",
    "React",
    "Next.js",
    "UI Design",
    "Gutenberg",
    "Elementor",
    "Web Development",
    "JavaScript",
    "TypeScript",
    "PHP",
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
        <script
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
        />
      </head>
      <body
        className={`${bodyFont.variable} ${displayFont.variable} min-h-screen bg-background font-body text-foreground`}
      >
        <Providers>
          <SkipToContent targetId="main-content" />
          <FloatingNav />
          {children}
          <Suspense fallback={null}>
            <AnalyticsConsent enabled={analyticsEnabled}>
              <Analytics nonce={nonce} />
              {isVercelProduction ? <VercelAnalytics /> : null}
            </AnalyticsConsent>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
