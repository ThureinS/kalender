'use client'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 animate-fade-in pt-16 text-muted-foreground">
      <div
        className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary"
        aria-hidden="true"
      />
      <p className="text-sm font-medium">Loading...</p>
    </div>
  );
};
