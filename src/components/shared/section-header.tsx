"use client";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}