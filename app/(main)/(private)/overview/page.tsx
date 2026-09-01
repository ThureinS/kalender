import { AppPageHeader } from "@/components/layout/product-surfaces"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DAYS_OF_WEEK_IN_ORDER } from "@/constants"
import { getEvents } from "@/server/actions/events"
import { getOrCreateProfile } from "@/server/actions/profiles"
import { getSchedule } from "@/server/actions/schedule"
import { auth, currentUser } from "@clerk/nextjs/server"
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Circle,
  ExternalLink,
  LinkIcon,
  Settings2,
} from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

type OverviewProfile = {
  displayName: string
  handle: string
}

function readSettled<T>(result: PromiseSettledResult<T>, fallback: T) {
  return result.status === "fulfilled" ? result.value : fallback
}

function SetupRow({
  complete,
  title,
  description,
  href,
  actionLabel,
  isNext,
}: {
  complete: boolean
  title: string
  description: string
  href: string
  actionLabel: string
  isNext?: boolean
}) {
  return (
    <Link
      href={href}
      className={[
        "group flex items-start gap-3 rounded-md border p-4 transition-colors",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35",
        isNext
          ? "border-primary/55 bg-primary/8 shadow-sm hover:border-primary hover:bg-primary/12"
          : complete
            ? "border-border/70 bg-background/70 hover:border-primary/35 hover:bg-accent/50"
            : "border-border/80 bg-background hover:border-primary/45 hover:bg-accent/60",
      ].join(" ")}
      aria-current={isNext ? "step" : undefined}
    >
      <span
        className={[
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border",
          isNext
            ? "border-primary bg-primary text-primary-foreground"
            : complete
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border bg-surface-subtle text-muted-foreground",
        ].join(" ")}
      >
        {complete ? (
          <CheckCircle2 className="size-4 text-primary" />
        ) : isNext ? (
          <ArrowRight className="size-4" />
        ) : (
          <Circle className="size-3 fill-current opacity-45" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="block text-sm font-semibold text-foreground">{title}</span>
          {isNext && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground">
              Next
            </span>
          )}
          {complete && (
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
              Done
            </span>
          )}
        </span>
        <span className="mt-1 block text-sm leading-6 text-muted-foreground">
          {description}
        </span>
      </span>
      <span
        className={[
          "hidden shrink-0 items-center gap-1 self-center text-sm font-semibold sm:flex",
          isNext ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
        ].join(" ")}
      >
        {actionLabel}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode
  label: string
  value: string
  detail: string
}) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex size-9 items-center justify-center rounded-md border border-border/80 bg-surface-subtle text-primary">
          {icon}
        </div>
        <div>
          <CardDescription>{label}</CardDescription>
          <CardTitle className="mt-2 text-2xl">{value}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

export default async function OverviewPage() {
  const { userId, redirectToSignIn } = await auth()
  if (!userId) return redirectToSignIn()

  const user = await currentUser()
  const [eventsResult, scheduleResult, profileResult] = await Promise.allSettled([
    getEvents(userId),
    getSchedule(userId),
    getOrCreateProfile({
      clerkUserId: userId,
      displayName: user?.fullName,
      avatarUrl: user?.imageUrl,
      email: user?.primaryEmailAddress?.emailAddress,
    }),
  ])

  const events = readSettled(eventsResult, [])
  const schedule = readSettled(scheduleResult, null)
  const profile = readSettled<OverviewProfile>(profileResult, {
    displayName: user?.fullName || "Kalender host",
    handle: "",
  })
  const dataLoadFailed =
    eventsResult.status === "rejected" ||
    scheduleResult.status === "rejected" ||
    profileResult.status === "rejected"
  const profileLoadFailed = profileResult.status === "rejected"
  const eventsLoadFailed = eventsResult.status === "rejected"
  const scheduleLoadFailed = scheduleResult.status === "rejected"

  const availabilityDays = new Set(
    schedule?.availabilities?.map(availability => availability.dayOfWeek)
  )
  const connectedGoogleAccount = user?.externalAccounts.find(
    account => account.provider === "google"
  )
  const publicEvents = events.filter(
    event => event.isActive && event.visibility === "public"
  )
  const setupItems = [
    {
      complete: !profileLoadFailed && Boolean(profile.displayName && profile.handle),
      title: "Booking Page identity",
      description: profileLoadFailed
        ? "Booking Page details are temporarily unavailable."
        : `${profile.displayName} has a Public URL ready at /book/${profile.handle}.`,
      href: "/booking-page",
      actionLabel: "Edit page",
    },
    {
      complete: !scheduleLoadFailed && availabilityDays.size > 0,
      title: "Weekly availability",
      description:
        scheduleLoadFailed
          ? "Availability could not be checked right now."
          :
        availabilityDays.size > 0
          ? `${availabilityDays.size} day${availabilityDays.size === 1 ? "" : "s"} configured.`
          : "Add the weekly windows people can book.",
      href: "/schedule",
      actionLabel: "Set hours",
    },
    {
      complete: !eventsLoadFailed && publicEvents.length > 0,
      title: "Bookable events",
      description:
        eventsLoadFailed
          ? "Events could not be checked right now."
          :
        publicEvents.length > 0
          ? `${publicEvents.length} public event${publicEvents.length === 1 ? "" : "s"} visible.`
          : "Create a public event so visitors have something to book.",
      href: "/events",
      actionLabel: "Review events",
    },
    {
      complete: Boolean(connectedGoogleAccount),
      title: "Google Calendar",
      description: connectedGoogleAccount
        ? `Connected as ${connectedGoogleAccount.emailAddress}.`
        : "Connect Google so Kalender can check conflicts and create calendar events.",
      href: "/integrations",
      actionLabel: "Connect",
    },
  ]
  const completedSetupItems = setupItems.filter(item => item.complete).length
  const nextSetupItem = setupItems.find(item => !item.complete)
  const visibleDays = DAYS_OF_WEEK_IN_ORDER.filter(day => availabilityDays.has(day))

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <AppPageHeader
        eyebrow="Workspace"
        title="Overview"
        description="See whether your scheduling workspace is ready to share and jump into the next useful task."
        action={
          profile.handle ? (
            <Button asChild>
              <Link href={`/book/${profile.handle}`} target="_blank">
                <ExternalLink className="size-4" />
                Open Public URL
              </Link>
            </Button>
          ) : (
            <Button disabled>
              <ExternalLink className="size-4" />
              Open Public URL
            </Button>
          )
        }
      />

      {dataLoadFailed && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/25 bg-destructive/8 p-4 text-sm text-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="min-w-0">
            <p className="font-semibold">Some workspace data could not load.</p>
            <p className="mt-1 leading-6 text-muted-foreground">
              Kalender is still available, but this page may show temporary setup states until the database connection recovers.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Settings2 className="size-4" />}
          label="Setup"
          value={`${completedSetupItems}/${setupItems.length}`}
          detail="Profile, availability, events, and calendar connection."
        />
        <MetricCard
          icon={<CalendarDays className="size-4" />}
          label="Events"
          value={eventsLoadFailed ? "Check" : `${events.length}`}
          detail={
            eventsLoadFailed
              ? "Events are temporarily unavailable."
              : `${publicEvents.length} public and active for your Booking Page.`
          }
        />
        <MetricCard
          icon={<CalendarClock className="size-4" />}
          label="Availability"
          value={scheduleLoadFailed ? "Check" : `${availabilityDays.size}`}
          detail={
            scheduleLoadFailed
              ? "Availability is temporarily unavailable."
              : visibleDays.length > 0
              ? visibleDays.map(day => day.slice(0, 3)).join(", ")
              : "No weekly windows configured yet."
          }
        />
        <MetricCard
          icon={<CalendarCheck2 className="size-4" />}
          label="Bookings"
          value="Calendar"
          detail="Confirmed meetings are created in Google Calendar."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Launch Checklist</CardTitle>
              <span className="rounded-full border border-border/80 bg-surface-subtle px-3 py-1 text-xs font-semibold text-muted-foreground">
                {nextSetupItem ? "Needs attention" : "Ready to share"}
              </span>
            </div>
            <CardDescription>
              {nextSetupItem
                ? `Start with ${nextSetupItem.title.toLowerCase()} to keep setup moving.`
                : "Profile, events, availability, and calendar connection are ready."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {setupItems.map(item => (
              <SetupRow
                key={item.title}
                {...item}
                isNext={nextSetupItem?.title === item.title}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Link</CardTitle>
            <CardDescription>
              The public destination visitors use to choose an event.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border/80 bg-surface-subtle p-4">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Public URL
              </p>
              <p className="mt-2 break-all font-mono text-sm text-foreground">
                {profile.handle ? `/book/${profile.handle}` : "Unavailable"}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Button asChild variant="outline">
                <Link href="/booking-page">
                  <LinkIcon className="size-4" />
                  Edit Booking Page
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/events/new">
                  <CalendarDays className="size-4" />
                  Create Event
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
