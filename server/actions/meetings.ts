"use server"

import { getBookingAccess } from "@/server/bookingAccess"
import { auth } from "@clerk/nextjs/server"
import { DEMO_BOOKING_LIMIT_MESSAGE } from "@/lib/demo-booking-limits"
import { createHash } from "node:crypto"
import { addDays } from "date-fns"
import { db } from "@/drizzle/db"
import { meetingActionSchema } from "@/schema/meetings"
import { BOOKING_HORIZON_DAYS, conflictRange } from "@/lib/availability"
import { completeBooking } from "@/lib/booking-workflow"
import { getValidTimesForEventRange } from "@/server/queries/schedule"
import { DemoBookingLimitError, getReservation, reserveBooking } from "@/server/queries/reservations"
import { createCalendarEvent } from "@/server/google/googleCalendar"
import { createConfirmedBooking } from "@/server/queries/bookings"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function createMeeting(unsafeData: z.infer<typeof meetingActionSchema>) {
  const parsed = meetingActionSchema.safeParse(unsafeData)
  if (!parsed.success) return { error: "Check your booking details and try again." } as const
  const data = parsed.data
  const access = await getBookingAccess(data.clerkUserId)
  if (access !== "allowed") return {
    error: access === "sign-in-required"
      ? "Sign in to try a booking with the demo host."
      : "Live demo bookings are not available for this host.",
  } as const
  const { userId: bookerClerkUserId } = await auth()
  if (!bookerClerkUserId) return { error: "Sign in to try a booking with the demo host." } as const
  const { requestId, ...request } = data
  const requestHash = createHash("sha256").update(JSON.stringify(request)).digest("hex")
  try {
    const priorReservation = await getReservation(requestId)
    if (priorReservation?.payload.bookerClerkUserId &&
        priorReservation.payload.bookerClerkUserId !== bookerClerkUserId) {
      return { error: "Sign in with the account that started this booking to retry it." } as const
    }
    if (priorReservation && priorReservation.requestHash !== requestHash) {
      return { error: "This attempt already has different details. Retry the original details or contact the host before starting another booking." } as const
    }
    const booking = await completeBooking({
      findCompleted: async () => {
        const existing = await db.query.BookingTable.findFirst({
          where: ({ id }, { eq }) => eq(id, requestId),
        })
        if (existing && (!priorReservation || existing.clerkUserId !== data.clerkUserId)) {
          throw new Error("Request id is already in use")
        }
        return existing
      },
      reserve: async () => {
        if (priorReservation) return priorReservation
        const event = await db.query.EventTable.findFirst({
          where: ({ id, clerkUserId, isActive, visibility }, { and, eq }) => and(
            eq(id, data.eventId), eq(clerkUserId, data.clerkUserId), eq(isActive, true), eq(visibility, "public")),
        })
        const now = new Date()
        if (!event || data.startTime <= now || data.startTime > addDays(now, BOOKING_HORIZON_DAYS)) {
          throw new Error("Unavailable event or time")
        }
        const valid = await getValidTimesForEventRange({ start: data.startTime, end: data.startTime, event })
        if (!valid.length) throw new Error("Unavailable slot")
        const range = conflictRange(data.startTime, event.durationInMinutes, event.bufferMinutes)
        return reserveBooking({ id: requestId, clerkUserId: data.clerkUserId,
          requestHash, startTime: range.start, endTime: range.end,
          payload: { eventId: event.id, eventName: event.name, eventSlug: event.slug,
            eventDurationInMinutes: event.durationInMinutes, eventLocation: event.location,
            guestName: data.guestName, guestEmail: data.guestEmail, guestNotes: data.guestNotes,
            timezone: data.timezone, startTime: data.startTime.toISOString() },
        }, bookerClerkUserId)
      },
      createCalendarEvent: reservation => createCalendarEvent({
        ...reservation.payload, clerkUserId: reservation.clerkUserId,
        isDemoBooking: true,
        startTime: new Date(reservation.payload.startTime),
        durationInMinutes: reservation.payload.eventDurationInMinutes,
        calendarEventId: requestId.replaceAll("-", ""),
      }),
      persist: async (reservation, calendar) => {
        const result = await createConfirmedBooking({
          ...reservation.payload, clerkUserId: reservation.clerkUserId,
          startTime: new Date(reservation.payload.startTime),
          googleCalendarEventId: calendar.id, googleCalendarHtmlLink: calendar.htmlLink,
        }, requestId)
        if (!result) throw new Error("Booking persistence was not confirmed")
        return result
      },
    })
    revalidatePath("/bookings")
    return { bookingId: booking.id } as const
  } catch (error) {
    if (error instanceof DemoBookingLimitError) return { error: DEMO_BOOKING_LIMIT_MESSAGE } as const
    // Do not log raw provider/database errors: they can contain tokens, SQL and
    // guest data. The request id is sufficient for operator reconciliation.
    console.error("Booking could not be confirmed", { requestId })
    return { error: "We could not confirm this booking. Retry with the same details. If it continues, contact the host before starting another booking." } as const
  }
}
