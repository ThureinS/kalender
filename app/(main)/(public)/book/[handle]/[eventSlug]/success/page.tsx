import {
  BookingContentColumn,
  BookingIdentityRail,
  BookingPageSplit,
} from "@/components/layout/product-surfaces";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatEventDescription } from "@/lib/formatters";
import {
  getCalendarUserForProfile,
  resolvePublicEvent,
  resolvePublicProfileSegment,
} from "@/server/publicBooking";
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string; eventSlug: string }>
  searchParams: Promise<{ startTime?: string }>
}) {
  const { handle, eventSlug } = await params
  const { startTime } = await searchParams
  const { profile, isLegacySegment } = await resolvePublicProfileSegment(handle)
  if (!profile || !startTime) notFound()

  const event = await resolvePublicEvent(profile, eventSlug)
  if (!event) notFound()

  const canonicalEventSlug = event.slug ?? event.id
  if (isLegacySegment || eventSlug !== canonicalEventSlug) {
    redirect(
      `/book/${profile.handle}/${canonicalEventSlug}/success?startTime=${encodeURIComponent(startTime)}`
    )
  }

  const calendarUser = await getCalendarUserForProfile(profile)
  if (!calendarUser) notFound()

  const startTimeDate = new Date(startTime)
  if (Number.isNaN(startTimeDate.getTime())) notFound()

  const hostName = profile.displayName || calendarUser.fullName || "Kalender host"

  return (
    <BookingPageSplit className="min-h-[calc(100dvh-6rem)] py-8">
      <BookingIdentityRail className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-8 top-6 h-24 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_36px_-10px_var(--primary)]">
            <CheckCircle2 className="size-7" />
          </div>

          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Booking Confirmed
          </p>
          <h1 className="mt-2 break-words font-display text-3xl font-semibold tracking-normal text-foreground lg:text-4xl">
            You're booked with {hostName}
          </h1>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            A confirmation email is on its way with the calendar details for this meeting.
          </p>

          <div className="mt-6 space-y-3 border-t border-border/80 pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              {formatEventDescription(event.durationInMinutes)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              {event.location}
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Kalender handled the scheduling
            </div>
          </div>
        </div>
      </BookingIdentityRail>

      <BookingContentColumn>
        <div className="rounded-lg border border-border/80 bg-card p-8 text-card-foreground shadow-[0_0_36px_-24px_var(--primary)]">
          <div className="flex size-12 items-center justify-center rounded-full border border-border/80 bg-background text-primary">
            <CalendarCheck2 className="size-6" />
          </div>
          <p className="mt-5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {event.name}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-normal">
            {formatDateTime(startTimeDate)}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Keep an eye on your inbox for the confirmation and calendar invite. You can safely close this page.
          </p>

          <div className="mt-6 rounded-lg border border-border/80 bg-surface-subtle/30 p-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Confirmation sent</p>
                <p className="mt-1 leading-6">
                  The host receives your details, and you receive the meeting information by email.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link href={`/book/${profile.handle}`}>View more events</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/book/${profile.handle}/${canonicalEventSlug}`}>
                Book another time
              </Link>
            </Button>
          </div>
        </div>
      </BookingContentColumn>
    </BookingPageSplit>
  )
}
