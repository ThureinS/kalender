import "server-only"
import { db } from "@/drizzle/db"
import { BookingReservationTable } from "@/drizzle/schema"
import { and, eq, gt, lt } from "drizzle-orm"

export async function getReservation(id: string) {
  return db.query.BookingReservationTable.findFirst({ where: eq(BookingReservationTable.id, id) })
}

export async function reserveBooking(data: typeof BookingReservationTable.$inferInsert) {
  // Postgres exclusion constraint serializes overlapping requests across
  // processes/instances. A duplicate request id is safe to retry.
  const [reservation] = await db.insert(BookingReservationTable).values(data)
    .onConflictDoNothing({ target: BookingReservationTable.id }).returning()
  const result = reservation ?? await getReservation(data.id)
  if (!result || result.requestHash !== data.requestHash) throw new Error("Request mismatch")
  return result
}

export async function getReservationTimes(clerkUserId: string, range: { start: Date; end: Date }) {
  const rows = await db.select({ start: BookingReservationTable.startTime, end: BookingReservationTable.endTime })
    .from(BookingReservationTable).where(and(
      eq(BookingReservationTable.clerkUserId, clerkUserId),
      lt(BookingReservationTable.startTime, range.end),
      gt(BookingReservationTable.endTime, range.start),
    ))
  return rows
}
