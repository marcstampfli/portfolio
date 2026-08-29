export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent motion-reduce:animate-none"
          aria-hidden="true"
        />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
