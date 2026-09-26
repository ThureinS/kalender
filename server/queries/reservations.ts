import "server-only"
import { db } from "@/drizzle/db"
import { BookingReservationTable } from "@/drizzle/schema"
import { and, eq, gt, lt, sql } from "drizzle-orm"
import { DEMO_HOST_BOOKING_LIMIT } from "@/lib/demo-booking-limits"

export class DemoBookingLimitError extends Error {}

export async function getReservation(id: string) {
  return db.query.BookingReservationTable.findFirst({ where: eq(BookingReservationTable.id, id) })
}

export async function reserveBooking(data: typeof BookingReservationTable.$inferInsert,
  bookerClerkUserId: string) {
  // The host lock and conditional insert run in one Neon transaction. Taking
  // the lock in a separate statement gives the insert a fresh READ COMMITTED
  // snapshot after concurrent requests finish. The exclusion constraint still
  // enforces slot conflicts. Existing request IDs remain retryable at the cap.
  const payload = { ...data.payload, bookerClerkUserId }
  await db.batch([
    db.execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${data.clerkUserId}, 0))`),
    db.execute(sql`
      INSERT INTO "bookingReservations"
        (id, "clerkUserId", "startTime", "endTime", "requestHash", payload)
      SELECT ${data.id}::uuid, ${data.clerkUserId},
        ${data.startTime.toISOString()}::timestamp, ${data.endTime.toISOString()}::timestamp,
        ${data.requestHash}, ${JSON.stringify(payload)}::jsonb
      WHERE (
        SELECT count(*) FROM "bookingReservations"
        WHERE "clerkUserId" = ${data.clerkUserId}
          AND "createdAt" > CURRENT_TIMESTAMP - interval '24 hours'
      ) < ${DEMO_HOST_BOOKING_LIMIT}
      ON CONFLICT (id) DO NOTHING
    `),
  ])
  const result = await getReservation(data.id)
  if (!result) throw new DemoBookingLimitError()
  if (result.requestHash !== data.requestHash ||
      result.payload.bookerClerkUserId !== bookerClerkUserId) throw new Error("Request mismatch")
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
