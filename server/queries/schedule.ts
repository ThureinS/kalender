import "server-only"
import { db } from "@/drizzle/db"
import { getCalendarEventTimes } from "@/server/google/googleCalendar"
import { candidateTimes, conflictRange, withoutConflicts } from "@/lib/availability"
import { getReservationTimes } from "@/server/queries/reservations"

export async function getSchedule(userId: string) {
  return db.query.ScheduleTable.findFirst({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    with: { availabilities: true },
  })
}
export type FullSchedule = NonNullable<Awaited<ReturnType<typeof getSchedule>>>

type EventAvailability = { clerkUserId: string; durationInMinutes: number; bufferMinutes?: number }

export async function getValidTimesForEventRange({ start, end, event }: {
  start: Date; end: Date; event: EventAvailability
}) {
  const schedule = await getSchedule(event.clerkUserId)
  if (!schedule?.availabilities.length) return []
  const candidates = candidateTimes({ start, end, timezone: schedule.timezone,
    availabilities: schedule.availabilities, durationInMinutes: event.durationInMinutes })
  if (!candidates.length) return []
  const range = {
    start: conflictRange(candidates[0], event.durationInMinutes, event.bufferMinutes).start,
    end: conflictRange(candidates[candidates.length - 1], event.durationInMinutes, event.bufferMinutes).end,
  }
  const [calendarBusy, reservations] = await Promise.all([
    getCalendarEventTimes(event.clerkUserId, range),
    getReservationTimes(event.clerkUserId, range),
  ])
  return withoutConflicts(candidates, [...calendarBusy, ...reservations], event.durationInMinutes, event.bufferMinutes)
}
