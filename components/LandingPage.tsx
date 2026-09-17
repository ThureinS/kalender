import {
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  LinkIcon,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react"
import Link from "next/link"

import {
  StorefrontContainer,
  StorefrontSurface,
} from "@/components/layout/product-surfaces"
import LandingSignedInRedirect from "@/components/LandingSignedInRedirect"
import { Button } from "@/components/ui/button"

const bookingEvents = [
  {
    name: "Strategy Sprint",
    description: "A focused working session for product, growth, or portfolio direction.",
    duration: "45 min",
    location: "Google Meet",
  },
  {
    name: "Launch Review",
    description: "Walk through readiness, calendar access, and shareable next steps.",
    duration: "30 min",
    location: "Google Meet",
  },
  {
    name: "Office Hours",
    description: "Short async cleanup, blockers, and scheduling follow-up.",
    duration: "15 min",
    location: "Online",
  },
]

const workflowSteps = [
  "Shape your public booking page",
  "Publish event links visitors can choose",
  "Set weekly availability and buffers",
  "Connect Google Calendar when ready",
]

const bookingRows = [
  {
    guest: "Maya Chen",
    event: "Strategy Sprint",
    time: "Today, 1:45 PM",
    status: "confirmed",
  },
  {
    guest: "Jordan Lee",
    event: "Launch Review",
    time: "Tomorrow, 10:30 AM",
    status: "confirmed",
  },
  {
    guest: "Priya Shah",
    event: "Office Hours",
    time: "Fri, 4:00 PM",
    status: "rescheduled",
  },
]

function MiniBookingPagePreview() {
  return (
    <div className="rounded-lg border border-border/80 bg-card p-3 text-card-foreground shadow-[0_0_44px_-20px_var(--primary)] sm:p-4">
      <div className="grid gap-3 md:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="relative overflow-hidden rounded-md border border-border/80 bg-storefront-rail p-4">
          <div className="pointer-events-none absolute inset-x-8 top-3 h-16 rounded-full bg-primary/20 blur-2xl" />
          <div className="relative">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary font-display text-sm font-semibold text-primary-foreground shadow-[0_0_28px_-8px_var(--primary)]">
              AS
            </div>
            <p className="mt-4 font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Booking Page
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-normal">
              Avery Stone
            </h2>
            <p className="mt-3 text-sm font-medium leading-6">
              Book a focused strategy session without calendar back-and-forth.
            </p>
            <div className="mt-4 space-y-2 border-t border-border/80 pt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="size-3.5 text-primary" />
                Online meetings
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="size-3.5 text-primary" />
                Asia/Bangkok
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/80 px-2.5 py-1 font-mono">
                <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_2px_var(--primary)]" />
                Open for scheduling
              </span>
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-3">
          <div className="rounded-md border border-border/80 bg-background p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  Available Events
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold tracking-normal">
                  Choose a time to meet
                </h3>
              </div>
              <span className="inline-flex min-w-0 items-center gap-2 rounded-full border border-border/80 px-3 py-1.5 text-xs text-muted-foreground">
                <LinkIcon className="size-3.5 shrink-0 text-primary" />
                <span className="truncate">/book/demo-strategy-studio</span>
              </span>
            </div>
          </div>

          {bookingEvents.map(event => (
            <div
              key={event.name}
              className="grid gap-3 rounded-md border border-border/80 bg-card p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="min-w-0">
                <h4 className="break-words font-display text-lg font-semibold tracking-normal">
                  {event.name}
                </h4>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {event.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 px-2.5 py-1 font-mono">
                    <Clock3 className="size-3.5 text-primary" />
                    {event.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 px-2.5 py-1">
                    <MapPin className="size-3.5 text-primary" />
                    {event.location}
                  </span>
                </div>
              </div>
              <span className="inline-flex h-9 w-fit items-center justify-center gap-2 rounded-md border border-primary/70 bg-primary px-3 text-sm font-medium text-primary-foreground">
                Book
                <ArrowRight className="size-4" />
              </span>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

function WorkspacePreview() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="rounded-lg border border-border/80 bg-card p-5 text-card-foreground">
        <div className="flex flex-col gap-3 border-b border-border/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Workspace
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-normal">
              Setup stays visible until the link is ready
            </h2>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <CheckCircle2 className="size-3.5" />
            Ready to share
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {workflowSteps.map((step, index) => (
            <div
              key={step}
              className="flex items-start gap-3 rounded-md border border-border/80 bg-background p-4"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold">{step}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {index === 0 && "Name, handle, headline, timezone, and location."}
                  {index === 1 && "Reusable event types with durations and locations."}
                  {index === 2 && "Bookable windows and buffer-aware conflict checks."}
                  {index === 3 && "Calendar events created after confirmed bookings."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="rounded-lg border border-border/80 bg-card p-5 text-card-foreground">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Bookings
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold tracking-normal">
              Stored history
            </h3>
          </div>
          <CalendarCheck2 className="size-5 text-primary" />
        </div>
        <div className="mt-5 divide-y divide-border/80 rounded-md border border-border/80">
          {bookingRows.map(row => (
            <div key={`${row.guest}-${row.time}`} className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{row.guest}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {row.event}
                  </p>
                </div>
                <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[11px] font-medium capitalize text-primary">
                  {row.status}
                </span>
              </div>
              <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarClock className="size-3.5 text-primary" />
                {row.time}
              </p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

export default function LandingPage() {
  return (
    <StorefrontSurface className="overflow-hidden">
      <LandingSignedInRedirect />
      <StorefrontContainer className="relative">
        <header className="flex min-h-20 items-center justify-between gap-4 border-b border-border/80 py-4">
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-normal text-foreground"
          >
            Kalender
          </Link>
          <nav className="flex items-center gap-2" aria-label="Public">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">
                Start
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </nav>
        </header>

        <section className="grid min-h-[calc(100dvh-5rem)] gap-8 py-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(520px,1.14fr)] lg:items-center lg:py-12">
          <div className="max-w-2xl">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border/80 bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="size-2 rounded-full bg-primary shadow-[0_0_10px_2px_var(--primary)]" />
              <span className="sm:hidden">Scheduling product demo</span>
              <span className="hidden sm:inline">Public booking pages, event links, availability, and booking history</span>
            </div>

            <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.03] tracking-normal text-foreground sm:text-6xl">
              Booking links that respect your calendar.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Build a polished booking page, publish focused event types, protect your calendar with availability and buffers, then keep a local history of confirmed meetings.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/register">
                  Create a booking page
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/book/demo-strategy-studio">
                  View live demo
                  <ExternalLink className="size-4" />
                </Link>
              </Button>
            </div>

            <dl className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-border/80 bg-secondary/60 p-4">
                <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CalendarDays className="size-4 text-primary" />
                  Event links
                </dt>
                <dd className="mt-2 font-display text-2xl font-semibold">3</dd>
              </div>
              <div className="rounded-md border border-border/80 bg-secondary/60 p-4">
                <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CalendarClock className="size-4 text-primary" />
                  Open days
                </dt>
                <dd className="mt-2 font-display text-2xl font-semibold">5</dd>
              </div>
              <div className="rounded-md border border-border/80 bg-secondary/60 p-4">
                <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CalendarCheck2 className="size-4 text-primary" />
                  Demo bookings
                </dt>
                <dd className="mt-2 font-display text-2xl font-semibold">8</dd>
              </div>
            </dl>
          </div>

          <div className="relative min-w-0">
            <div className="absolute -inset-8 -z-10 bg-[radial-gradient(circle_at_70%_28%,color-mix(in_oklch,var(--primary)_24%,transparent),transparent_34%)]" />
            <MiniBookingPagePreview />
          </div>
        </section>
      </StorefrontContainer>

      <section className="border-y border-border/80 bg-surface-subtle/70 py-12">
        <StorefrontContainer>
          <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Product Shape
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal sm:text-4xl">
                The public link and private workspace stay connected.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Kalender is built around the real scheduling workflow: set up the page, expose only bookable events, confirm meetings through Google Calendar, and retain the booking snapshot.
              </p>
            </div>
            <WorkspacePreview />
          </div>
        </StorefrontContainer>
      </section>

      <section className="py-12">
        <StorefrontContainer>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border/80 bg-card p-5">
              <LinkIcon className="size-5 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold tracking-normal">
                Share one readable URL
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Public routes use clean handles like `/book/demo-strategy-studio` and event slugs for direct links.
              </p>
            </div>
            <div className="rounded-lg border border-border/80 bg-card p-5">
              <ShieldCheck className="size-5 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold tracking-normal">
                Respect real availability
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Visitors only see valid slots, while buffers and calendar conflicts protect the host&apos;s day.
              </p>
            </div>
            <div className="rounded-lg border border-border/80 bg-card p-5">
              <UserRound className="size-5 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold tracking-normal">
                Keep the host in control
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Onboarding, integrations, booking page settings, events, and history live in one workspace.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-border/80 bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Sparkles className="size-4" />
                  Portfolio demo is ready locally
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-normal">
                  Open the seeded demo profile or create your own workspace.
                </h2>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button asChild>
                  <Link href="/book/demo-strategy-studio">
                    Demo profile
                    <ExternalLink className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </StorefrontContainer>
      </section>
    </StorefrontSurface>
  )
}
