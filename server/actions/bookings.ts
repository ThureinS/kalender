'use server'

import { db } from "@/drizzle/db"
import { BookingTable } from "@/drizzle/schema"
import { confirmedBookingSchema } from "@/schema/bookings"
import { addMinutes } from "date-fns"
import { desc, eq } from "drizzle-orm"
import { z } from "zod"

export type BookingRow = typeof BookingTable.$inferSelect

export async function createConfirmedBooking({
  eventDurationInMinutes,
  startTime,
  ...data
}: z.infer<typeof confirmedBookingSchema>) {
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
    .returning()

  return booking
}

export async function getBookingsForUser(clerkUserId: string) {
  return db.query.BookingTable.findMany({
    where: eq(BookingTable.clerkUserId, clerkUserId),
    orderBy: [desc(BookingTable.startTime)],
  })
}
