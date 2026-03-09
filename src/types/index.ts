/**
 * Central type definitions for the portfolio application
 * All types are exported from this file for consistent usage across the app
 */

import { z } from "zod";

// =============================================================================
// Database/Prisma Types
// =============================================================================

export interface TechStack {
  id: string;
  name: string;
  category: string;
  version: string | null;
}

export interface Achievement {
  id: string;
  description: string;
  experience_id: string;
}

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
  year: number | null;
}

export interface ProjectWithTechStack extends Project {
  tech_stack: string[];
}

// API Response type for projects
export interface ProjectResponse extends Omit<Project, "tech_stack"> {
  tech_stack: string[];
}

// =============================================================================
// Experience Types
// =============================================================================

export interface Experience {
  id: string;
  title: string;
  company: string;
  position: string;
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
  created_at?: Date | string;
  updated_at?: Date | string;
}

// API Response type for experiences
export interface ExperienceResponse {
  id: string;
  title: string;
  company: string;
  position: string;
  period: string;
  location: string | null;
  type: string | null;
  start_date: string;
  end_date: string | null;
  description: string;
  tech_stack: string[];
  achievements: string[];
  logo?: string | null;
  logo_background?: "none" | "light" | "dark";
  logo_fit?: "contain" | "cover";
  logo_width?: number | null;
  logo_height?: number | null;
  logo_padding?: number | null;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Contact Form Types
// =============================================================================

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  website: z.string().optional().default(""),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: Date | string;
}

// =============================================================================
// UI Component Types
// =============================================================================

export interface SubmitButtonProps {
  isSubmitting: boolean;
  isSubmitted: boolean;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

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
  design: "Design",
  development: "Development",
};

export function getProjectTypeDisplayName(slug: string): string {
  return (
    PROJECT_TYPE_DISPLAY_NAMES[slug.toLowerCase()] ||
    slug.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
}
