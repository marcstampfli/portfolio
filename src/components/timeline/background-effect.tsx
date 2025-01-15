"use client";

export function BackgroundEffect() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]" />
      <div className="absolute right-0 top-1/4 h-[500px] w-[500px]">
        <div className="absolute inset-0 rotate-45 animate-pulse-slow">
          <div className="absolute inset-[40%] rounded-full border border-primary/20" />
          <div className="absolute inset-[30%] rounded-full border border-primary/20" />
          <div className="absolute inset-[20%] rounded-full border border-primary/20" />
        </div>
      </div>
    </>
  );
}
