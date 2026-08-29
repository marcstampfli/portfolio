interface ParallaxBackgroundProps {
  children: React.ReactNode;
}

export function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--grid-color)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--grid-color)) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />
      </div>
      {children}
    </div>
  );
}
