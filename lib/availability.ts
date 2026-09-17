import { addDays, addMinutes, areIntervalsOverlapping } from "date-fns"
import { formatInTimeZone, fromZonedTime } from "date-fns-tz"
import { DAYS_OF_WEEK_IN_ORDER } from "@/constants"

export const BOOKING_HORIZON_DAYS = 60
export const SLOT_MINUTES = 15
export type BusyInterval = { start: Date; end: Date }
export type WeeklyAvailability = {
  dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number]
  startTime: string
  endTime: string
}

// UTC instants throughout; only the owner's weekly wall-clock windows need
// conversion. Iterating calendar dates avoids the server's timezone and DST.
export function candidateTimes({ start, end, timezone, availabilities, durationInMinutes }: {
  start: Date; end: Date; timezone: string
  availabilities: WeeklyAvailability[]; durationInMinutes: number
}) {
  if (end < start) return []
  const firstDate = formatInTimeZone(start, timezone, "yyyy-MM-dd")
  const lastDate = formatInTimeZone(end, timezone, "yyyy-MM-dd")
  const dates = new Set<number>()
  for (let day = new Date(`${firstDate}T12:00:00Z`); day.toISOString().slice(0, 10) <= lastDate; day = addDays(day, 1)) {
    const date = day.toISOString().slice(0, 10)
    const weekday = DAYS_OF_WEEK_IN_ORDER[(day.getUTCDay() + 6) % 7]
    for (const window of availabilities.filter(item => item.dayOfWeek === weekday)) {
      const windowStart = fromZonedTime(`${date}T${window.startTime.padStart(5, "0")}:00`, timezone)
      const windowEnd = fromZonedTime(`${date}T${window.endTime.padStart(5, "0")}:00`, timezone)
      // A nonexistent spring-forward wall time must not silently move a window.
      if (formatInTimeZone(windowStart, timezone, "yyyy-MM-dd'T'HH:mm") !== `${date}T${window.startTime.padStart(5, "0")}` ||
          formatInTimeZone(windowEnd, timezone, "yyyy-MM-dd'T'HH:mm") !== `${date}T${window.endTime.padStart(5, "0")}`) continue
      for (let time = windowStart; addMinutes(time, durationInMinutes) <= windowEnd; time = addMinutes(time, SLOT_MINUTES)) {
        if (time >= start && time <= end) dates.add(time.getTime())
      }
    }
  }
  return [...dates].sort((a, b) => a - b).map(time => new Date(time))
}

export function conflictRange(start: Date, durationInMinutes: number, bufferMinutes = 0) {
  return { start: addMinutes(start, -bufferMinutes), end: addMinutes(start, durationInMinutes + bufferMinutes) }
}

export function withoutConflicts(times: Date[], busy: BusyInterval[], duration: number, buffer = 0) {
  return times.filter(time => busy.every(interval =>
    !areIntervalsOverlapping(interval, conflictRange(time, duration, buffer))
  ))
}
