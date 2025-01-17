"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Icons = {
  X: dynamic(() => import("lucide-react").then((mod) => mod.X)),
  Filter: dynamic(() => import("lucide-react").then((mod) => mod.Filter)),
};

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

export function ProjectFilters({
  activeFilter,
  searchQuery,
  activeType,
  onFilterChange,
  onSearchChange,
  onTypeChange,
  projectTypes,
  className,
}: ProjectFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClearFilters = () => {
    onFilterChange("");
    onSearchChange("");
    onTypeChange(null);
  };

  const getButtonVariant = (isActive: boolean): "default" | "outline" =>
    isActive ? "default" : "outline";

  return (
    <div className={cn("space-y-6", className)}>
      {/* Mobile Filters Toggle */}
      <div className="flex items-center justify-between gap-4 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Icons.Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFilter !== "all" || searchQuery || activeType && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {(activeFilter !== "all" ? 1 : 0) +
                (searchQuery ? 1 : 0) +
                (activeType ? 1 : 0)}
            </span>
          )}
        </Button>
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Filters Content */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : "auto" }}
        className={cn("space-y-6", {
          "hidden lg:block": !isOpen,
        })}
      >
        {/* Project Type Filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Project Types</h3>
          <div className="flex flex-wrap gap-2">
            {projectTypes?.map((type, index) => (
              <Button
                key={`${type}-${index}`}
                variant={getButtonVariant(activeFilter === type)}
                size="sm"
                onClick={() => onFilterChange(type)}
                className="capitalize"
              >
                {type}
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="pr-8"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Icons.X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Summary */}
        <AnimatePresence>
          {activeFilter !== "all" || searchQuery || activeType && (
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
                  <div
                    key={`active-filter-${activeFilter}`}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs"
                  >
                    <span>Type: {activeFilter}</span>
                    <button
                      onClick={() => onFilterChange("all")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Icons.X className="h-3 w-3" />
                      <span className="sr-only">Remove type filter</span>
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
                      <Icons.X className="h-3 w-3" />
                      <span className="sr-only">Clear search</span>
                    </button>
                  </div>
                )}
                {activeType && (
                  <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
                    <span>Type: {activeType}</span>
                    <button
                      onClick={() => onTypeChange(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Icons.X className="h-3 w-3" />
                      <span className="sr-only">Remove type filter</span>
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
