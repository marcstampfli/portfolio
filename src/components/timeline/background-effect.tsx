"use client";

export function BackgroundEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute left-[8%] top-[14%] h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[8%] right-[10%] h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
    </div>
  );
}
