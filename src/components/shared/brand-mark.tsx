import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "transition-theme flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-primary font-display text-[0.62rem] font-bold tracking-[0.1em] text-primary-foreground group-hover:bg-primary/90",
        className
      )}
    >
      MS
    </span>
  );
}
