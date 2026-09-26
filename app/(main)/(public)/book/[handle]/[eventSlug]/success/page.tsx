import DemoBookingNotice from "@/components/DemoBookingNotice"
import { isDemoBookingHost } from "@/server/bookingAccess"
import { z } from "zod"
import { getBookingReceipt } from "@/server/queries/bookings"

import {
  BookingContentColumn,
  BookingIdentityRail,
  BookingPageSplit,
} from "@/components/layout/product-surfaces";
import { Button } from "@/components/ui/button";
import { formatEventDescription } from "@/lib/formatters";
import {
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
import Link from "@/components/NavigationLink";
import { notFound } from "next/navigation";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string; eventSlug: string }>
  searchParams: Promise<{ bookingId?: string }>
}) {
  const { handle, eventSlug } = await params
  const { bookingId } = await searchParams
  if (!bookingId || !z.uuid().safeParse(bookingId).success) notFound()
  const { profile } = await resolvePublicProfileSegment(handle)
  if (!profile) notFound()
  const booking = await getBookingReceipt(bookingId, profile.clerkUserId)
  if (!booking || booking.eventSlug !== eventSlug) notFound()
  const canonicalEventSlug = booking.eventSlug
  const hostName = profile.displayName || "Kalender host"

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
            You&apos;re booked with {hostName}
          </h1>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Your booking is saved. Google Calendar was asked to send an invitation
            to the email address you entered.
          </p>

          <div className="mt-6 space-y-3 border-t border-border/80 pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              {formatEventDescription(booking.eventDurationInMinutes)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              {booking.eventLocation}
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Kalender handled the scheduling
            </div>
          </div>
        </div>
      </BookingIdentityRail>

      <BookingContentColumn>
        {isDemoBookingHost(profile.clerkUserId) && <DemoBookingNotice />}
        <div className="rounded-lg border border-border/80 bg-card p-8 text-card-foreground shadow-[0_0_36px_-24px_var(--primary)]">
          <div className="flex size-12 items-center justify-center rounded-full border border-border/80 bg-background text-primary">
            <CalendarCheck2 className="size-6" />
          </div>
          <p className="mt-5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {booking.eventName}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-normal">
            {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: booking.timezone }).format(booking.startTime)} ({booking.timezone})
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            If you used your own real email address, check your inbox and spam folder
            for the Google Calendar invitation. You can safely close this page.
          </p>

          <div className="mt-6 rounded-lg border border-border/80 bg-surface-subtle/30 p-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Google Calendar invitation</p>
                <p className="mt-1 leading-6">
                  Booking confirmation does not verify email delivery. Shared demo
                  login addresses do not provide an inbox; use your own real email
                  in the booking form to test invitations.
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
