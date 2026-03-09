import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Marc Stämpfli Portfolio",
    short_name: "Marc Stämpfli",
    description:
      "Web developer and designer with 15+ years of experience building websites and products.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#3B82F6",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
