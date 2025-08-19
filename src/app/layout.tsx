import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { PerformanceMonitor } from "@/components/shared/performance-monitor";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Marc Stämpfli - Web Developer & Designer",
  description:
    "Portfolio website showcasing web development and design projects.",
  keywords: "web development, design, portfolio, next.js, react, typescript",
  authors: [{ name: "Marc Stämpfli" }],
  creator: "Marc Stämpfli",
  metadataBase: new URL("https://www.marcstampfli.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your actual verification code
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#3B82F6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#60A5FA" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`${inter.className} min-h-screen antialiased bg-background text-foreground transition-colors duration-300 will-change-auto`}>
        <Providers>
          {children}
          <ThemeToggle />
          <PerformanceMonitor />
        </Providers>
      </body>
    </html>
  );
}
