import { canCreateBooking } from "@/server/bookingAccess"
import { BOOKING_HORIZON_DAYS } from "@/lib/availability"
import { ArrowLeft, CalendarDays, Clock, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import {
  addDays,
  roundToNearestMinutes,
} from "date-fns"
import { getSchedule, getValidTimesForEventRange } from "@/server/queries/schedule";
import NoTimeSlots from "@/components/NoTimeSlots";
import MeetingForm from "@/components/forms/MeetingForm";
import { notFound, redirect } from "next/navigation";
import {
  BookingContentColumn,
  BookingIdentityRail,
  BookingPageSplit,
} from "@/components/layout/product-surfaces";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatEventDescription } from "@/lib/formatters";
import { getProfileAccentStyle } from "@/lib/profileAccent";
import {
  resolvePublicEvent,
  resolvePublicProfileSegment,
} from "@/server/publicBooking";

export default async function BookingPage({
    params,
    searchParams,
  }: {
    params: Promise<{ handle: string; eventSlug: string }>
    searchParams: Promise<{ preview?: string }>
  }) {

    const { handle, eventSlug } = await params
    const { preview } = await searchParams
    const { profile, isLegacySegment } = await resolvePublicProfileSegment(handle)
    if (!profile) notFound()

    // Fetch the event details from the database using the provided user and event IDs
    const event = await resolvePublicEvent(profile, eventSlug)
    // If event doesn't exist, show a 404 page
    if(!event) notFound()

    const canonicalEventSlug = event.slug ?? event.id
    if (isLegacySegment || eventSlug !== canonicalEventSlug) {
      redirect(`/book/${profile.handle}/${canonicalEventSlug}`)
    }

    const calendarUser = { id: profile.clerkUserId, fullName: profile.displayName }

    const schedule = await getSchedule(profile.clerkUserId)
    const hasAvailability = (schedule?.availabilities.length ?? 0) > 0

    if (!hasAvailability) {
      return (
        <div style={getProfileAccentStyle(profile.accent)}>
          <NoTimeSlots
            event={event}
            calendarUser={calendarUser}
            profileHandle={profile.handle}
            eventSlug={canonicalEventSlug}
            reason="availability-not-set"
          />
        </div>
      )
    }

    if (process.env.NODE_ENV === "development" && preview === "no-slots") {
      return (
        <NoTimeSlots
          event={event}
          calendarUser={calendarUser}
          profileHandle={profile.handle}
          eventSlug={canonicalEventSlug}
        />
      )
    }

     // Keep provider work and client payloads bounded to the booking horizon.
    const startDate = roundToNearestMinutes(new Date(), {
      nearestTo: 15,
      roundingMethod: "ceil",
    })
    
    const endDate = addDays(new Date(), BOOKING_HORIZON_DAYS)

     // Generate valid available time slots for the event using the custom scheduler logic
  const bookingEnabled = await canCreateBooking()
  const validTimes = await getValidTimesForEventRange({
    start: startDate,
    end: endDate,
    event,
  })

   // If no valid time slots are available, show a message and an option to pick another event
   if (validTimes.length === 0) {
    return (
      <NoTimeSlots
        event={event}
        calendarUser={calendarUser}
        profileHandle={profile.handle}
        eventSlug={canonicalEventSlug}
      />
    )
  }


  // Render the booking form with the list of valid available times
  return (
    <div style={getProfileAccentStyle(profile.accent)}>
      <BookingPageSplit className="min-h-[calc(100dvh-6rem)] py-8">
        <BookingIdentityRail className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-8 top-6 h-24 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <Button asChild variant="ghost" size="sm" className="-ml-3 mb-6">
              <Link href={`/book/${profile.handle}`}>
                <ArrowLeft className="size-4" />
                All events
              </Link>
            </Button>

            <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_36px_-10px_var(--primary)]">
              <CalendarDays className="size-7" />
            </div>

            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Booking Flow
            </p>
            <h1 className="mt-2 break-words font-display text-3xl font-semibold tracking-normal text-foreground lg:text-4xl">
              {event.name}
            </h1>

            {event.description && (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {event.description}
              </p>
            )}

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
                Hosted by {profile.displayName || calendarUser.fullName || "Kalender host"}
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Confirmation after details
              </div>
            </div>
          </div>
        </BookingIdentityRail>

        <BookingContentColumn>
          <div className="rounded-lg border border-border/80 bg-card p-5 text-card-foreground shadow-[0_0_36px_-24px_var(--primary)] sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Availability
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-normal">
                  Pick a date and time
                </h2>
              </div>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/80 px-3 py-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary" />
                Live availability
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Kalender only shows times that fit the host&apos;s availability and existing calendar.
            </p>
          </div>

          <MeetingForm
              bookingEnabled={bookingEnabled}
            validTimes={validTimes}
            eventId={event.id}
            clerkUserId={profile.clerkUserId}
            profileHandle={profile.handle}
            eventSlug={canonicalEventSlug}
          />
        </BookingContentColumn>
      </BookingPageSplit>
    </div>
  )   

  }
