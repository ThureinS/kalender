import { AppPageHeader } from "@/components/layout/product-surfaces"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getEvents } from "@/server/actions/events"
import { getOrCreateProfile } from "@/server/actions/profiles"
import { auth, currentUser } from "@clerk/nextjs/server"
import {
  CalendarCheck2,
  CalendarClock,
  ExternalLink,
  Inbox,
  LinkIcon,
} from "lucide-react"
import Link from "next/link"

export default async function BookingsPage() {
  const { userId, redirectToSignIn } = await auth()
  if (!userId) return redirectToSignIn()

  const user = await currentUser()
  const [events, profile] = await Promise.all([
    getEvents(userId),
    getOrCreateProfile({
      clerkUserId: userId,
      displayName: user?.fullName,
      avatarUrl: user?.imageUrl,
      email: user?.primaryEmailAddress?.emailAddress,
    }),
  ])

  const activeEvents = events.filter(event => event.isActive)

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <AppPageHeader
        eyebrow="Workspace"
        title="Bookings"
        description="Track the meetings created from your Booking Page."
        action={
          <Button asChild variant="outline">
            <Link href={`/book/${profile.handle}`} target="_blank">
              <ExternalLink className="size-4" />
              Open Public URL
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Stored Bookings</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Kalender does not have a local bookings table yet.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active Events</CardDescription>
            <CardTitle className="text-3xl">{activeEvents.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Active event links can still create meetings for visitors.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Booking Destination</CardDescription>
            <CardTitle className="text-xl">Google Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Confirmed meetings are written directly to your calendar.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-md border border-border/80 bg-surface-subtle text-primary">
            <Inbox className="size-6" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-semibold tracking-normal">
            Booking history is not stored yet
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            The booking flow validates availability, checks Google Calendar busy
            times, and creates a calendar event. A local booking history can be
            added when Kalender has a persisted meeting model.
          </p>

          <div className="mt-8 grid w-full max-w-3xl gap-3 text-left md:grid-cols-3">
            <div className="rounded-lg border border-border/80 bg-background p-4">
              <CalendarClock className="size-5 text-primary" />
              <p className="mt-3 text-sm font-medium">Availability checked</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Visitors can only select valid time slots.
              </p>
            </div>
            <div className="rounded-lg border border-border/80 bg-background p-4">
              <CalendarCheck2 className="size-5 text-primary" />
              <p className="mt-3 text-sm font-medium">Calendar event created</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Confirmed meetings are sent to Google Calendar.
              </p>
            </div>
            <div className="rounded-lg border border-border/80 bg-background p-4">
              <LinkIcon className="size-5 text-primary" />
              <p className="mt-3 text-sm font-medium">Booking Link remains live</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Your public page continues to accept bookings.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link href="/events">Manage Events</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/integrations">Review Google Calendar</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
