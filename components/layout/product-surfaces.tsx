import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SurfaceProps = {
  children: ReactNode;
  className?: string;
};

type ThemedSurfaceProps = SurfaceProps & {
  theme?: "midnight" | "daylight";
};

export function StorefrontSurface({
  children,
  className,
  theme = "midnight",
}: ThemedSurfaceProps) {
  return (
    <main
      data-kalender-theme={theme}
      className={cn(
        "min-h-dvh bg-storefront-background text-foreground",
        className
      )}
    >
      {children}
    </main>
  );
}

export function StorefrontContainer({ children, className }: SurfaceProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function BookingPageSplit({ children, className }: SurfaceProps) {
  return (
    <div
      className={cn(
        "mx-auto grid min-h-dvh w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-12",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BookingIdentityRail({ children, className }: SurfaceProps) {
  return (
    <aside
      className={cn(
        "rounded-lg border border-border/80 bg-storefront-rail p-5 md:sticky md:top-8 md:self-start",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function BookingContentColumn({ children, className }: SurfaceProps) {
  return (
    <section className={cn("min-w-0 space-y-4", className)}>{children}</section>
  );
}

export function AppShellSurface({ children, className }: SurfaceProps) {
  return (
    <div
      data-kalender-theme="daylight"
      className={cn("min-h-dvh bg-app-shell-background text-foreground", className)}
    >
      {children}
    </div>
  );
}

export function AppShellFrame({ children, className }: SurfaceProps) {
  return (
    <div className={cn("mx-auto flex min-h-dvh w-full max-w-[1440px]", className)}>
      {children}
    </div>
  );
}

export function AppShellSidebar({ children, className }: SurfaceProps) {
  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar px-4 py-5 text-sidebar-foreground lg:block",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function AppShellMain({ children, className }: SurfaceProps) {
  return (
    <main className={cn("min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8", className)}>
      {children}
    </main>
  );
}

export function AppPageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-2xl font-semibold tracking-normal text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
