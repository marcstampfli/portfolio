declare module "@/components/shared/project-filters" {
  import { ComponentType } from "react";

  interface ProjectFiltersProps {
    activeFilter: string;
    searchQuery: string;
    activeType: string | null;
    onFilterChange: (filter: string) => void;
    onSearchChange: (query: string) => void;
    onTypeChange: (type: string | null) => void;
    projectTypes: string[];
    className?: string;
  }

  export const ProjectFilters: ComponentType<ProjectFiltersProps>;
}

declare module "@/components/shared/project-modal" {
  import { ComponentType } from "react";
  import { Project } from "@/types/prisma";

  interface ProjectModalProps {
    project: Project | null;
    onClose: () => void;
  }

  export const ProjectModal: ComponentType<ProjectModalProps>;
}

declare module "@/components/shared/optimized-image" {
  import { ComponentType } from "react";
  import { ImageProps } from "next/image";

  export const OptimizedImage: ComponentType<ImageProps>;
}

declare module "@/components/shared/project-tag" {
  import { ComponentType, ReactNode } from "react";

  interface ProjectTagProps {
    children: ReactNode;
  }

  export const ProjectTag: ComponentType<ProjectTagProps>;
}

declare module "@/components/ui/button" {
  import {
    ForwardRefExoticComponent,
    RefAttributes,
    ButtonHTMLAttributes,
  } from "react";
  import { VariantProps } from "class-variance-authority";

  interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariants> {
    asChild?: boolean;
  }

  export const Button: ForwardRefExoticComponent<
    ButtonProps & RefAttributes<HTMLButtonElement>
  >;
  export const buttonVariants: (props: ButtonProps) => string;
}

declare module "@/app/actions" {
  import { Project } from "@/types/prisma";
  const getProjects: () => Promise<Project[]>;
  export { getProjects };
}

declare module "@/hooks/use-debounce" {
  export function useDebounce<T>(value: T, delay?: number): T;
}

declare module "@prisma/client" {
  import { PrismaClient } from "@prisma/client";
  const prisma: PrismaClient;
  export default prisma;
}

declare module "@/types/project" {
  import { Project } from "@/types/prisma";
  export type { Project };
}

declare module "@/lib/prisma" {
  import { PrismaClient } from "@prisma/client";
  const prisma: PrismaClient;
  export { prisma };
}
