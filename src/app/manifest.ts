import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Marc Stämpfli Portfolio",
    short_name: "Marc Stämpfli",
    description:
      "Web developer and designer with 15+ years of experience building websites and products.",
    start_url: "/",
    display: "standalone",
    background_color: "#edf3f8",
    theme_color: "#edf3f8",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
