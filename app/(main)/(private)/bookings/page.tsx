import { AppPageHeader } from "@/components/layout/product-surfaces"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDateTime, formatEventDescription } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import {
  getBookingsForUser,
  type BookingRow,
} from "@/server/queries/bookings"
import { getEvents } from "@/server/queries/events"
import { getOrCreateProfile } from "@/server/queries/profiles"
import { auth, currentUser } from "@clerk/nextjs/server"
import {
  CalendarCheck2,
  CalendarClock,
  ExternalLink,
  Inbox,
  LinkIcon,
  Mail,
  MapPin,
  UserRound,
} from "lucide-react"
import Link from "next/link"

function BookingHistorySection({
  title,
  description,
  bookings,
  emptyMessage,
}: {
  title: string
  description: string
  bookings: BookingRow[]
  emptyMessage: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className="font-display text-2xl tracking-normal">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/80 bg-surface-subtle/30 p-6 text-sm leading-6 text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="divide-y divide-border/80 overflow-hidden rounded-lg border border-border/80">
            {bookings.map(booking => (
              <article
                key={booking.id}
                className="grid gap-4 bg-background p-4 md:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="break-words font-display text-lg font-semibold tracking-normal">
                      {booking.eventName}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                        booking.status === "confirmed"
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border/80 bg-surface-subtle text-muted-foreground"
                      )}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <CalendarClock className="size-4 shrink-0 text-primary" />
                      <span className="truncate">
                        {formatDateTime(booking.startTime, booking.timezone)}
                      </span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <UserRound className="size-4 shrink-0 text-primary" />
                      <span className="truncate">{booking.guestName}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <Mail className="size-4 shrink-0 text-primary" />
                      <a
                        href={`mailto:${booking.guestEmail}`}
                        className="truncate underline-offset-4 hover:underline"
                      >
                        {booking.guestEmail}
                      </a>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <MapPin className="size-4 shrink-0 text-primary" />
                      <span className="truncate">
                        {booking.eventLocation || "Location not set"}
                      </span>
                    </div>
                  </div>

                  {booking.guestNotes && (
                    <p className="mt-3 rounded-md border border-border/80 bg-surface-subtle/30 px-3 py-2 text-sm leading-6 text-muted-foreground">
                      {booking.guestNotes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground md:items-end">
                  <span>
                    {formatEventDescription(booking.eventDurationInMinutes)}
                  </span>
                  <span>{booking.timezone}</span>
                  {booking.googleCalendarHtmlLink && (
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={booking.googleCalendarHtmlLink}
                        target="_blank"
                      >
                        <ExternalLink className="size-4" />
                        Google event
                      </Link>
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default async function BookingsPage() {
  const { userId, redirectToSignIn } = await auth()
  if (!userId) return redirectToSignIn()

  const user = await currentUser()
  const [events, profile, bookings] = await Promise.all([
    getEvents(userId),
    getOrCreateProfile({
      clerkUserId: userId,
      displayName: user?.fullName,
      avatarUrl: user?.imageUrl,
      email: user?.primaryEmailAddress?.emailAddress,
    }),
    getBookingsForUser(userId),
  ])

  const activeEvents = events.filter(event => event.isActive)
  const now = new Date()
  const upcomingBookings = bookings
    .filter(
      booking =>
        booking.status === "confirmed" &&
        booking.startTime.getTime() >= now.getTime()
    )
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
  const pastBookings = bookings
    .filter(booking => booking.startTime.getTime() < now.getTime())
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())

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
            <CardTitle className="text-3xl">{bookings.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Confirmed public bookings are now saved in Kalender.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Upcoming</CardDescription>
            <CardTitle className="text-3xl">{upcomingBookings.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Future confirmed meetings from your Booking Page.
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
              Active public links can accept new bookings.
            </p>
          </CardContent>
        </Card>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-md border border-border/80 bg-surface-subtle text-primary">
              <Inbox className="size-6" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold tracking-normal">
              No bookings stored yet
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Kalender now saves confirmed public bookings after the Google
              Calendar event is created. New bookings will appear here with
              upcoming and past history.
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
                  Confirmed meetings are sent to Google Calendar first.
                </p>
              </div>
              <div className="rounded-lg border border-border/80 bg-background p-4">
                <LinkIcon className="size-5 text-primary" />
                <p className="mt-3 text-sm font-medium">History saved locally</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Kalender stores the booking snapshot for this workspace.
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
      ) : (
        <div className="grid gap-5">
          <BookingHistorySection
            title="Upcoming bookings"
            description="Confirmed meetings that have not started yet."
            bookings={upcomingBookings}
            emptyMessage="No upcoming bookings. Past bookings remain available below."
          />
          <BookingHistorySection
            title="Past bookings"
            description="Completed meetings saved from the public booking flow."
            bookings={pastBookings}
            emptyMessage="Past booking history will appear after confirmed meetings pass their start time."
          />
        </div>
      )}
    </section>
  )
}
