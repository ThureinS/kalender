import {
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  LinkIcon,
  ShieldCheck,
} from "lucide-react"
import Link from "@/components/NavigationLink"
import type { ReactNode } from "react"

import {
  StorefrontContainer,
  StorefrontSurface,
} from "@/components/layout/product-surfaces"

type AuthPageShellProps = {
  children: ReactNode
  eyebrow: string
  title: string
  description: string
}

const authHighlights = [
  {
    icon: CalendarDays,
    title: "Create event links",
    description: "Set durations, locations, visibility, and buffers.",
  },
  {
    icon: CalendarClock,
    title: "Open real availability",
    description: "Only bookable windows appear on the public page.",
  },
  {
    icon: CalendarCheck2,
    title: "Keep booking history",
    description: "Confirmed meetings are retained in the workspace.",
  },
]

export default function AuthPageShell({
  children,
  eyebrow,
  title,
  description,
}: AuthPageShellProps) {
  return (
    <StorefrontSurface>
      <StorefrontContainer>
        <main className="grid min-h-dvh gap-6 py-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.75fr)] lg:items-center lg:gap-8 lg:py-8">
          <section className="order-2 flex flex-col justify-between gap-8 rounded-lg border border-border/80 bg-surface-subtle/55 p-5 sm:p-6 lg:order-1 lg:min-h-[calc(100dvh-4rem)] lg:p-8">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-display text-xl font-semibold tracking-normal text-foreground"
              >
                Kalender
              </Link>

              <div className="mt-8 max-w-2xl lg:mt-20">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border/80 bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <span className="size-2 rounded-full bg-primary shadow-[0_0_10px_2px_var(--primary)]" />
                  Scheduling workspace
                </div>
                <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-normal text-foreground sm:text-5xl">
                  Start with the booking page. Grow into the workspace.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  Kalender turns availability, event links, Google Calendar, and booking history into one focused scheduling flow.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {authHighlights.map(item => {
                const Icon = item.icon

                return (
                  <article
                    key={item.title}
                    className="rounded-md border border-border/80 bg-background p-4"
                  >
                    <Icon className="size-5 text-primary" />
                    <h2 className="mt-4 text-sm font-semibold text-foreground">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="order-1 min-w-0 lg:order-2">
            <div className="mb-5 rounded-lg border border-border/80 bg-card p-4 text-card-foreground shadow-[0_0_36px_-24px_var(--primary)]">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                  <LinkIcon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {eyebrow}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-normal text-foreground">
                    {title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            </div>

            <div className="kalender-auth">{children}</div>

            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              Google Calendar access is requested only during setup.
            </div>
          </section>
        </main>
      </StorefrontContainer>
    </StorefrontSurface>
  )
}
