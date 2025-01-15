"use client"

import { Search } from "lucide-react"
import { ProjectCategory, projectCategories } from "@/data/projects"
import { cn } from "@/lib/utils"

interface ProjectFiltersProps {
  activeFilter: Lowercase<ProjectCategory>
  searchQuery: string
  activeTech: string | null
  onFilterChange: (filter: Lowercase<ProjectCategory>) => void
  onSearchChange: (query: string) => void
  onTechChange: (tech: string | null) => void
  availableTechs: string[]
  className?: string
}

export function ProjectFilters({
  activeFilter,
  searchQuery,
  activeTech,
  onFilterChange,
  onSearchChange,
  onTechChange,
  availableTechs,
  className,
}: ProjectFiltersProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {projectCategories.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter.toLowerCase() as Lowercase<ProjectCategory>)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-medium transition-colors",
              activeFilter === filter.toLowerCase()
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Search and tech stack filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 rounded-full border border-input bg-background pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* Tech stack filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {availableTechs.map((tech) => (
            <button
              key={tech}
              onClick={() => onTechChange(activeTech === tech ? null : tech)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                activeTech === tech
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 