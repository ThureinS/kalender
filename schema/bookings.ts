import { z } from "zod"

const optionalNullableText = z.string().optional().nullable()

export const confirmedBookingSchema = z.object({
  clerkUserId: z.string().min(1, "Required"),
  eventId: z.string().uuid("Invalid event id"),
  eventName: z.string().min(1, "Required"),
  eventSlug: optionalNullableText,
  eventDurationInMinutes: z.number().int().positive(),
  eventLocation: optionalNullableText,
  guestName: z.string().min(1, "Required"),
  guestEmail: z.string().email(),
  guestNotes: optionalNullableText,
  timezone: z.string().min(1, "Required"),
  startTime: z.date(),
  googleCalendarEventId: optionalNullableText,
  googleCalendarHtmlLink: z.string().url().optional().nullable(),
})
