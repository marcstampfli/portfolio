"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Filter } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProjectFiltersProps {
  activeFilter: string;
  searchQuery: string;
  activeTech: string | null;
  onFilterChange: (filter: string) => void;
  onSearchChange: (query: string) => void;
  onTechChange: (tech: string | null) => void;
  availableTechs: string[];
  categories: string[];
  className?: string;
}

export function ProjectFilters({
  activeFilter,
  searchQuery,
  activeTech,
  onFilterChange,
  onSearchChange,
  onTechChange,
  availableTechs,
  categories,
  className,
}: ProjectFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  const handleClearFilters = () => {
    onFilterChange("all");
    onSearchChange("");
    onTechChange(null);
  };

  const hasActiveFilters = activeFilter !== "all" || searchQuery || activeTech;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Mobile Filters Toggle */}
      <div className="flex items-center justify-between gap-4 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {(activeFilter !== "all" ? 1 : 0) +
                (searchQuery ? 1 : 0) +
                (activeTech ? 1 : 0)}
            </span>
          )}
        </Button>
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSearchChange(e.target.value)
            }
            className="w-full"
          />
        </div>
      </div>

      {/* Filters Content */}
      <motion.div
        initial={false}
        animate={{ height: showMobileFilters ? "auto" : "auto" }}
        className={cn("space-y-6", {
          "hidden lg:block": !showMobileFilters,
        })}
      >
        {/* Category Filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Input (Desktop) */}
        <div className="hidden lg:block space-y-3">
          <h3 className="text-sm font-medium">Search</h3>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              className="pr-8"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </div>
        </div>

        {/* Tech Stack Filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {availableTechs.map((tech) => (
              <motion.div key={tech} layout>
                <Button
                  variant={activeTech === tech ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    onTechChange(activeTech === tech ? null : tech)
                  }
                >
                  {tech}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Active Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-auto px-2 py-1 text-xs"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeFilter !== "all" && (
                  <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
                    <span>Category: {activeFilter}</span>
                    <button
                      onClick={() => onFilterChange("all")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove category filter</span>
                    </button>
                  </div>
                )}
                {searchQuery && (
                  <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
                    <span>Search: {searchQuery}</span>
                    <button
                      onClick={() => onSearchChange("")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Clear search</span>
                    </button>
                  </div>
                )}
                {activeTech && (
                  <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
                    <span>Tech: {activeTech}</span>
                    <button
                      onClick={() => onTechChange(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove tech filter</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
