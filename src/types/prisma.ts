import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  tech_stack: string[];
  images: (string | StaticImport)[];
  client?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  figma_url?: string | null;
  status: string;
  order: number;
  created_at: string;
  updated_at: string;
}

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
  period: string;
  description: string;
  tech_stack: string[];
  achievements: string[];
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}
