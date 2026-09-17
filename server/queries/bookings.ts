import "server-only"

import { db } from "@/drizzle/db"
import { BookingTable } from "@/drizzle/schema"
import { confirmedBookingSchema } from "@/schema/bookings"
import { addMinutes } from "date-fns"
import { and, desc, eq } from "drizzle-orm"
import { z } from "zod"

export type BookingRow = typeof BookingTable.$inferSelect

export async function createConfirmedBooking({
  eventDurationInMinutes,
  startTime,
  ...data
}: z.infer<typeof confirmedBookingSchema>, bookingId: string) {
  const parsed = confirmedBookingSchema.safeParse({
    ...data,
    eventDurationInMinutes,
    startTime,
  })

  if (!parsed.success) {
    throw new Error("Invalid booking data.")
  }

  const bookingData = parsed.data

  const [booking] = await db
    .insert(BookingTable)
    .values({
      ...bookingData,
      id: bookingId,
      endTime: addMinutes(
        bookingData.startTime,
        bookingData.eventDurationInMinutes
      ),
      guestName: bookingData.guestName.trim(),
      guestEmail: bookingData.guestEmail.trim().toLowerCase(),
      guestNotes: bookingData.guestNotes?.trim() || null,
      eventLocation: bookingData.eventLocation || null,
      eventSlug: bookingData.eventSlug || null,
      googleCalendarEventId: bookingData.googleCalendarEventId || null,
      googleCalendarHtmlLink: bookingData.googleCalendarHtmlLink || null,
      status: "confirmed",
    })
    .onConflictDoNothing({ target: BookingTable.id })
    .returning()

  return booking ?? await db.query.BookingTable.findFirst({ where: eq(BookingTable.id, bookingId) })
}

export async function getBookingsForUser(clerkUserId: string) {
  return db.query.BookingTable.findMany({
    where: eq(BookingTable.clerkUserId, clerkUserId),
    orderBy: [desc(BookingTable.startTime)],
  })
}

// The unguessable booking id is a receipt capability. Never return guest PII.
export async function getBookingReceipt(id: string, clerkUserId: string) {
  return db.query.BookingTable.findFirst({
    where: and(eq(BookingTable.id, id), eq(BookingTable.clerkUserId, clerkUserId), eq(BookingTable.status, "confirmed")),
    columns: { eventName: true, eventSlug: true, eventDurationInMinutes: true,
      eventLocation: true, startTime: true, timezone: true },
  })
}
