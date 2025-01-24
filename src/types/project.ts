export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  project_type: "web" | "mobile" | "design";
  tech_stack: string[];
  images: string[];
  client?: string;
  github_url?: string;
  live_url?: string;
  figma_url?: string;
  status: "published" | "draft";
  order: number;
  created_at: string;
  updated_at: string;
  developed_at?: string;
}
