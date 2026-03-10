import { cn } from "@/lib/utils";

interface ProjectTagProps {
  children: React.ReactNode;
  className?: string;
}

export function ProjectTag({ children, className }: ProjectTagProps) {
  return (
    <span
      className={cn(
        "rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary sm:text-xs",
        className
      )}
    >
      {children}
    </span>
  );
}
