export interface Experience {
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
  created_at: string;
  updated_at: string;
}

export interface ExperienceResponse {
  id: string;
  title: string;
  company: string;
  position: string;
  period: string;
  location: string | null;
  type: string | null;
  start_date: string; // ISO string from API
  end_date: string | null; // ISO string from API
  description: string;
  tech_stack: string[];
  achievements: string[];
  created_at: string; // ISO string from API
  updated_at: string; // ISO string from API
}
