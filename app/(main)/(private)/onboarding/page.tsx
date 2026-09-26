import Link from "@/components/NavigationLink"
import { headers } from "next/headers"
import {
  AlertTriangle,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  Circle,
  ExternalLink,
  LinkIcon,
  Rocket,
  UserRound,
} from "lucide-react"
import type { ReactNode } from "react"

import BookingPageForm from "@/components/forms/BookingPageForm"
import EventForm from "@/components/forms/EventForm"
import { ScheduleForm } from "@/components/forms/ScheduleForm"
import { GoogleCalendarConnectButton } from "@/components/integrations/GoogleCalendarConnectButton"
import { AppPageHeader } from "@/components/layout/product-surfaces"
import { LaunchActions } from "@/components/onboarding/LaunchActions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DAYS_OF_WEEK_IN_ORDER } from "@/constants"
import { formatEventDescription } from "@/lib/formatters"
import { isProfileAccent } from "@/lib/profileAccent"
import {
  getSetupReadiness,
  hasGoogleCalendarScopes,
  isGoogleConnection,
} from "@/lib/setup-readiness"
import { getEvents } from "@/server/queries/events"
import { getOrCreateProfile } from "@/server/queries/profiles"
import { getSchedule } from "@/server/queries/schedule"
import { auth, currentUser } from "@clerk/nextjs/server"

type StepState = {
  id: string
  title: string
  description: string
  complete: boolean
  icon: ReactNode
}

function readSettled<T>(result: PromiseSettledResult<T>, fallback: T) {
  return result.status === "fulfilled" ? result.value : fallback
}

function StepHeading({
  eyebrow,
  title,
  description,
  complete,
}: {
  eyebrow: string
  title: string
  description: string
  complete: boolean
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold tracking-normal text-foreground">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <span
        className={[
          "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
          complete
            ? "border-primary/25 bg-primary/10 text-primary"
            : "border-border/80 bg-surface-subtle text-muted-foreground",
        ].join(" ")}
      >
        {complete ? (
          <CheckCircle2 className="size-3.5" />
        ) : (
          <Circle className="size-3.5" />
        )}
        {complete ? "Complete" : "Needs setup"}
      </span>
    </div>
  )
}

function UnavailableCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-5">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function OnboardingPage() {
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
  const profile = readSettled(profileResult, null)
  const googleAccount = user?.externalAccounts.find(
    account => isGoogleConnection(account)
  )
  const hasCalendarScopes = hasGoogleCalendarScopes(googleAccount)
  const readiness = getSetupReadiness({
    profile,
    schedule,
    events,
    googleAccount,
  })
  const publicEvents = readiness.publicActiveEvents
  const profileComplete = profileResult.status === "fulfilled" && readiness.profileIdentity
  const availabilityComplete =
    scheduleResult.status === "fulfilled" && readiness.availability
  const eventComplete = eventsResult.status === "fulfilled" && readiness.publicEvent
  const googleComplete = readiness.googleCalendar
  const readyToShare =
    profileComplete && availabilityComplete && eventComplete && googleComplete

  const stepStates: StepState[] = [
    {
      id: "identity",
      title: "Booking Page identity",
      description: "Name, Link Name, headline, bio, timezone, location, and accent.",
      complete: profileComplete,
      icon: <UserRound className="size-4" />,
    },
    {
      id: "availability",
      title: "Availability",
      description: "At least one saved weekly window.",
      complete: availabilityComplete,
      icon: <CalendarClock className="size-4" />,
    },
    {
      id: "event",
      title: "First event",
      description: "A public, active booking event.",
      complete: eventComplete,
      icon: <CalendarCheck2 className="size-4" />,
    },
    {
      id: "calendar",
      title: "Google Calendar",
      description: "Calendar connection for conflicts and confirmations.",
      complete: googleComplete,
      icon: <CalendarCheck2 className="size-4" />,
    },
    {
      id: "launch",
      title: "Launch",
      description: "Preview, copy, and share the Booking Link.",
      complete: readyToShare,
      icon: <Rocket className="size-4" />,
    },
  ]
  const currentStep = stepStates.find(step => !step.complete) ?? stepStates.at(-1)
  const availabilityDays = new Set(
    schedule?.availabilities?.map(availability => availability.dayOfWeek)
  )
  const visibleDays = DAYS_OF_WEEK_IN_ORDER.filter(day => availabilityDays.has(day))
  const bookingPath = profile?.handle ? `/book/${profile.handle}` : ""
  const accent = profile && isProfileAccent(profile.accent) ? profile.accent : "lime"
  const firstPublicEvent = publicEvents[0]
  const requestHeaders = await headers()
  const host = requestHeaders.get("host")
  const protocol =
    requestHeaders.get("x-forwarded-proto") ||
    (host?.startsWith("localhost") ? "http" : "https")
  const bookingUrl = host && bookingPath ? `${protocol}://${host}${bookingPath}` : bookingPath

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <AppPageHeader
        eyebrow="Setup"
        title="Onboarding"
        description="Complete the private setup workflow that takes your account from draft workspace to shareable Booking Page."
        action={
          <Button asChild variant="outline">
            <Link href="/overview">
              <LinkIcon className="size-4" />
              Overview
            </Link>
          </Button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-lg border border-border/80 bg-surface-raised p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Progress
              </p>
              <span className="rounded-full border border-border/80 bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                {stepStates.filter(step => step.complete).length}/{stepStates.length}
              </span>
            </div>
            <nav className="mt-4 space-y-1" aria-label="Onboarding steps">
              {stepStates.map(step => {
                const isCurrent = currentStep?.id === step.id

                return (
                  <Link
                    key={step.id}
                    href={`#${step.id}`}
                    aria-current={isCurrent ? "step" : undefined}
                    className={[
                      "flex items-start gap-3 rounded-md px-3 py-3 text-sm transition-colors",
                      isCurrent
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border",
                        step.complete
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : isCurrent
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background",
                      ].join(" ")}
                    >
                      {step.complete ? <CheckCircle2 className="size-4" /> : step.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold">{step.title}</span>
                      <span className="mt-1 block text-xs leading-5">{step.description}</span>
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 space-y-12">
          <section id="identity" className="scroll-mt-24 space-y-5">
            <StepHeading
              eyebrow="Step 1"
              title="Booking Page identity"
              description="Set the public identity visitors see before they choose an event."
              complete={profileComplete}
            />
            {profile ? (
              <BookingPageForm
                profile={{
                  displayName: profile.displayName,
                  handle: profile.handle,
                  headline: profile.headline ?? "",
                  bio: profile.bio ?? "",
                  timezone: profile.timezone,
                  location: profile.location ?? "",
                  accent,
                  avatarUrl: profile.avatarUrl,
                }}
              />
            ) : (
              <UnavailableCard
                title="Booking Page details are temporarily unavailable."
                description="The profile query did not complete, so this step cannot be edited until the database connection recovers."
              />
            )}
          </section>

          <section id="availability" className="scroll-mt-24 space-y-5 border-t border-border/80 pt-10">
            <StepHeading
              eyebrow="Step 2"
              title="Availability"
              description="Save at least one weekly window. Kalender will not create default hours for you."
              complete={availabilityComplete}
            />
            {scheduleResult.status === "rejected" ? (
              <UnavailableCard
                title="Availability could not be checked."
                description="Retry this step once the schedule query succeeds."
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Hours</CardTitle>
                  <CardDescription>
                    {availabilityComplete
                      ? `${schedule?.availabilities.length ?? 0} window${schedule?.availabilities.length === 1 ? "" : "s"} saved${visibleDays.length > 0 ? ` across ${visibleDays.map(day => day.slice(0, 3)).join(", ")}` : ""}.`
                      : "Add a day and time range, then save to unlock public booking."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScheduleForm schedule={schedule ?? undefined} requireAvailability />
                </CardContent>
              </Card>
            )}
          </section>

          <section id="event" className="scroll-mt-24 space-y-5 border-t border-border/80 pt-10">
            <StepHeading
              eyebrow="Step 3"
              title="First event"
              description="Create the event visitors can book from your public page."
              complete={eventComplete}
            />
            {eventsResult.status === "rejected" ? (
              <UnavailableCard
                title="Events could not be checked."
                description="Retry this step once the event query succeeds."
              />
            ) : firstPublicEvent ? (
              <Card>
                <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle>{firstPublicEvent.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {formatEventDescription(firstPublicEvent.durationInMinutes)} · {firstPublicEvent.location}
                    </CardDescription>
                  </div>
                  <Button asChild variant="outline">
                    <Link href="/events/new">Create Another</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border/80 bg-surface-subtle p-4">
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Event Link
                    </p>
                    <p className="mt-2 break-all font-mono text-sm">
                      {bookingPath}/{firstPublicEvent.slug || "event"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <EventForm
                profileHandle={profile?.handle}
                cancelHref="/onboarding#availability"
                returnHref="/onboarding"
                submitLabel="Create Event"
              />
            )}
          </section>

          <section id="calendar" className="scroll-mt-24 space-y-5 border-t border-border/80 pt-10">
            <StepHeading
              eyebrow="Step 4"
              title="Google Calendar"
              description="Connect Google Calendar so Kalender can check conflicts and create confirmed meetings."
              complete={googleComplete}
            />
            <Card>
              <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>Calendar connection</CardTitle>
                  <CardDescription className="mt-2">
                    {hasCalendarScopes
                      ? `Connected as ${googleAccount?.emailAddress}.`
                      : googleAccount
                        ? "Google is connected, but Kalender still needs Calendar access."
                        : "Google Calendar is not connected yet."}
                  </CardDescription>
                </div>
                <span
                  className={[
                    "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                    hasCalendarScopes
                      ? "border-primary/25 bg-primary/10 text-primary"
                      : "border-border/80 bg-surface-subtle text-muted-foreground",
                  ].join(" ")}
                >
                  {hasCalendarScopes ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <Circle className="size-3.5" />
                  )}
                  {hasCalendarScopes
                    ? "Connected"
                    : googleAccount
                      ? "Needs Calendar access"
                      : "Not connected"}
                </span>
              </CardHeader>
              <CardContent className="space-y-4">
                <GoogleCalendarConnectButton
                  sharedDemoVisitor={user?.privateMetadata.kalenderDemoVisitor === true}
                  connected={Boolean(googleAccount)}
                  hasCalendarScopes={hasCalendarScopes}
                />
                <Button asChild variant="outline">
                  <Link href="/integrations">View Integration Details</Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          <section id="launch" className="scroll-mt-24 space-y-5 border-t border-border/80 pt-10">
            <StepHeading
              eyebrow="Step 5"
              title="Launch"
              description="Use the public Booking Link once every readiness check is complete."
              complete={readyToShare}
            />
            <Card>
              <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>{readyToShare ? "Ready to share" : "Finish setup first"}</CardTitle>
                  <CardDescription className="mt-2">
                    {readyToShare
                      ? "Your identity, availability, public event, and calendar connection are ready."
                      : "The Booking Link stays visible for preview, but sharing is blocked until every step is complete."}
                  </CardDescription>
                </div>
                {bookingPath && (
                  <Button asChild variant="outline">
                    <Link href={bookingPath} target="_blank">
                      <ExternalLink className="size-4" />
                      Open
                    </Link>
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border/80 bg-surface-subtle p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Public Booking URL
                  </p>
                  <p className="mt-2 break-all font-mono text-sm text-foreground">
                    {bookingUrl || "Unavailable until Booking Page identity is saved"}
                  </p>
                </div>
                {bookingPath && (
                  <LaunchActions bookingPath={bookingPath} disabled={!readyToShare} />
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </section>
  )
}
