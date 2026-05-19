import { z } from "zod";

// =============================================================================
// Project Types
// =============================================================================

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  project_type: string;
  featured: boolean;
  images: string[];
  live_url: string | null;
  github_url: string | null;
  figma_url: string | null;
  client: string | null;
  status: string;
  order: number;
  year_start: number | null;
  year: number | null;
}

export interface ProjectWithTechStack extends Project {
  tech_stack: string[];
}

// =============================================================================
// Experience Types
// =============================================================================

export interface Experience {
  id: string;
  title: string;
  company: string;
  position: string | null;
  period: string;
  location: string | null;
  type: string | null;
  start_date: Date | string;
  end_date: Date | string | null;
  description: string;
  tech_stack: string[];
  achievements: string[];
  logo?: string | null;
  logo_background?: "none" | "light" | "dark";
  logo_fit?: "contain" | "cover";
  logo_width?: number | null;
  logo_height?: number | null;
  logo_padding?: number | null;
}

// =============================================================================
// Contact Form Types
// =============================================================================

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120, "Name is too long"),
  email: z.string().email("Invalid email address").max(254, "Email is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long (max 5000 characters)"),
  website: z.string().max(200).optional().default(""),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// =============================================================================
// Project Type Display Names
// =============================================================================

export const PROJECT_TYPE_DISPLAY_NAMES: Record<string, string> = {
  bizcard: "Business Card",
  web: "Web App",
  website: "Website",
  flyer: "Flyer",
  banner: "Banner",
  logo: "Logo",
  story: "Social Story",
  signage: "Digital Signage",
  ui: "UI Design",
  branding: "Branding",
  print: "Print Design",
  mobile: "Mobile App",
  desktop: "Desktop App",
};

export function getProjectTypeDisplayName(slug: string): string {
  return (
    PROJECT_TYPE_DISPLAY_NAMES[slug.toLowerCase()] ||
    slug.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
}
