import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleId?: string;
  subtitle?: string;
  actions?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  titleId,
  subtitle,
  actions,
  align = "left",
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div className={cn("flex flex-col gap-6", centered && "items-center text-center", className)}>
      <div className={cn("space-y-4", centered && "max-w-3xl")}>
        {eyebrow ? (
          <div className="section-kicker">
            <span className="eyebrow-dot" aria-hidden="true" />
            <span>{eyebrow}</span>
          </div>
        ) : null}
        <h2 id={titleId} className={cn("section-title text-balance", titleClassName)}>
          {title}
        </h2>
        {subtitle ? (
          <p className={cn("section-copy text-balance", centered && "mx-auto", subtitleClassName)}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
