export interface TechStack {
  id: string;
  name: string;
  category: string;
  version: string | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  project_type: string;
  images: string[];
  live_url: string | null;
  github_url: string | null;
  figma_url: string | null;
  client: string | null;
  status: string;
  order: number;
  created_at: Date;
  updated_at: Date;
  developed_at: Date | null;
  tech_stack: TechStack[];
}

export interface ProjectWithTechStack extends Omit<Project, "tech_stack"> {
  tech_stack: (Pick<TechStack, "name"> | string)[];
}

export interface Achievement {
  id: string;
  description: string;
  experience_id: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  position: string;
  period: string;
  location: string | null;
  type: string | null;
  start_date: Date;
  end_date: Date | null;
  description: string;
  created_at: Date;
  updated_at: Date;
  achievements: Achievement[];
  tech_stack: TechStack[];
}

export interface ExperienceWithTechStack extends Omit<Experience, "tech_stack"> {
  tech_stack: Pick<TechStack, "name">[];
}
