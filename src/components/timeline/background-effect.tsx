"use client";

export function BackgroundEffect() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute -left-4 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -right-4 top-3/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
    </div>
  );
}
