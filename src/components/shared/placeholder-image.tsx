import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface PlaceholderImageProps {
  className?: string;
  fill?: boolean;
}

export default function PlaceholderImage({ className, fill }: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-3",
        "bg-background/50 backdrop-blur-sm",
        fill && "h-full w-full",
        className
      )}
    >
      <div className="rounded-lg bg-primary/5 p-4 backdrop-blur-sm">
        <ImageOff className="h-8 w-8 text-primary/40" aria-hidden="true" />
        <span className="geist-mono mt-2 block text-sm text-muted-foreground">
          No project image available
        </span>
      </div>
    </div>
  );
}
