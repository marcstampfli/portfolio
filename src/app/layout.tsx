import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Marc Stampfli | Full Stack Developer & UI Designer",
    template: "%s | Marc Stampfli"
  },
  description: "Full Stack Developer and UI Designer specializing in modern web applications, WordPress development, and user-centered design solutions.",
  keywords: ["Full Stack Developer", "UI Designer", "Web Development", "React", "Next.js", "WordPress", "TypeScript", "JavaScript"],
  authors: [{ name: "Marc Stampfli" }],
  creator: "Marc Stampfli",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://marcstampfli.com",
    siteName: "Marc Stampfli Portfolio",
    title: "Marc Stampfli | Full Stack Developer & UI Designer",
    description: "Full Stack Developer and UI Designer specializing in modern web applications, WordPress development, and user-centered design solutions.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Marc Stampfli - Full Stack Developer & UI Designer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Marc Stampfli | Full Stack Developer & UI Designer",
    description: "Full Stack Developer and UI Designer specializing in modern web applications, WordPress development, and user-centered design solutions.",
    images: ["/og-image.jpg"],
    creator: "@marcstampfli"
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
    google: "your-google-site-verification",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} relative`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
