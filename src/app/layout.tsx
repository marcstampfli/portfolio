import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { env } from "@/lib/env";
import { Analytics } from "@/components/shared/analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3B82F6" },
    { media: "(prefers-color-scheme: dark)", color: "#60A5FA" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Marc Stämpfli - Web Developer & Designer",
    template: "%s | Marc Stämpfli",
  },
  description: "Portfolio website showcasing web development and design projects by Marc Stämpfli.",
  keywords: [
    "web development",
    "design",
    "portfolio",
    "next.js",
    "react",
    "typescript",
    "full-stack developer",
  ],
  authors: [{ name: "Marc Stämpfli" }],
  creator: "Marc Stämpfli",
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL || "https://www.marcstampfli.com"),
  alternates: {
    canonical: "/",
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
    url: "/",
    title: "Marc Stämpfli - Web Developer & Designer",
    description: "Portfolio website showcasing web development and design projects.",
    siteName: "Marc Stämpfli Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marc Stämpfli - Web Developer & Designer",
    description: "Portfolio website showcasing web development and design projects.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased transition-colors duration-300`}
      >
        <Providers>
          {children}
          <ThemeToggle />
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
