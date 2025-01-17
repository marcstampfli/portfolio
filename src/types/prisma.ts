export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  position: string;
  period: string;
  location?: string;
  type?: string;
  start_date: string;
  end_date: string | null;
  description: string;
  achievements: string[];
  tech_stack: string[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  project_type: string;
  tech_stack: string[];
  images: string[];
  live_url?: string;
  github_url?: string;
  figma_url?: string;
  client?: string;
  status: "published" | "draft";
  order: number;
  created_at: string;
  updated_at: string;
  developed_at: string;
}

export type PortfolioItem = Experience | Project;
