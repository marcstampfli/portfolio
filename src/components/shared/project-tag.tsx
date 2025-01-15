import { cn } from "@/lib/utils";

interface ProjectTagProps {
  children: React.ReactNode;
  className?: string;
}

export function ProjectTag({ children, className }: ProjectTagProps) {
  return (
    <span
      className={cn(
        "rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] sm:text-xs text-primary font-mono",
        className,
      )}
    >
      {children}
    </span>
  );
}
