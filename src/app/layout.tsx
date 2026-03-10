import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@/components/shared/analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { siteConfig } from "@/lib/site";

const isProduction = process.env.NODE_ENV === "production";

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
  keywords: [
    "web development",
    "WordPress developer",
    "web designer",
    "UI design",
    "React",
    "Next.js",
    "Trinidad and Tobago",
    "freelance developer",
    "Gutenberg",
    "Elementor",
    "full-stack developer",
  ],
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
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: "Marc Stämpfli Portfolio",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${bodyFont.variable} ${displayFont.variable} min-h-screen bg-background font-body text-foreground`}
      >
        <Providers>
          {children}
          <Suspense fallback={null}>
            <Analytics />
            {isProduction ? <VercelAnalytics /> : null}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
