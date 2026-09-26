import DemoBookingNotice from "./DemoBookingNotice";
import Link from "@/components/NavigationLink";
import { Button } from "./ui/button";
import {
  BookingContentColumn,
  BookingIdentityRail,
  BookingPageSplit,
} from "./layout/product-surfaces";
import { ArrowLeft, CalendarX2, Clock, MapPin, ShieldCheck } from "lucide-react";
import { formatEventDescription } from "@/lib/formatters";

// Component to render when no time slots are available for the selected event
export default function NoTimeSlots({
    event,
    calendarUser,
    profileHandle,
    eventSlug,
    reason = "no-slots",
    isDemoHost = false,
  }: {
    event: {
      name: string
      description: string | null
      durationInMinutes: number
      location: string
    }
    calendarUser: { id: string; fullName: string | null }
    profileHandle: string
    eventSlug: string
    reason?: "no-slots" | "availability-not-set" | "calendar-unavailable"
    isDemoHost?: boolean
  }) {
    const hostName = calendarUser.fullName || "Kalender host"
    const availabilityNotSet = reason === "availability-not-set"
    const calendarUnavailable = reason === "calendar-unavailable"

    return (
      <BookingPageSplit className="min-h-[calc(100dvh-6rem)] py-8">
        <BookingIdentityRail className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-8 top-6 h-24 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <Button asChild variant="ghost" size="sm" className="-ml-3 mb-6">
              <Link href={`/book/${profileHandle}`}>
                <ArrowLeft className="size-4" />
                All events
              </Link>
            </Button>

            <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_36px_-10px_var(--primary)]">
              <CalendarX2 className="size-7" />
            </div>

            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {availabilityNotSet || calendarUnavailable ? "Booking Paused" : "No Availability"}
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
                <ShieldCheck className="size-4 text-primary" />
                Hosted by {hostName}
              </div>
            </div>
          </div>
        </BookingIdentityRail>

        <BookingContentColumn>
          {isDemoHost && <DemoBookingNotice />}
          <div className="rounded-lg border border-border/80 bg-card p-8 text-card-foreground shadow-[0_0_36px_-24px_var(--primary)]">
            <div className="flex size-12 items-center justify-center rounded-full border border-border/80 bg-background text-primary">
              <CalendarX2 className="size-6" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold tracking-normal">
              {calendarUnavailable ? "Availability temporarily unavailable" : availabilityNotSet ? "Availability has not been set" : "No open slots right now"}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {calendarUnavailable
                ? "We could not check the host's calendar. Please try again later. No booking has been created."
                : availabilityNotSet
                ? `${hostName} has not opened booking times for this event yet. Please check back after availability is published.`
                : `${hostName} is currently booked up for this event. You can check back later or choose another available event from this booking page.`}
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link href={`/book/${profileHandle}`}>Choose another event</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/book/${profileHandle}/${eventSlug}`}>Check again</Link>
              </Button>
            </div>
          </div>
        </BookingContentColumn>
      </BookingPageSplit>
    )
  }
