import { beforeAll, beforeEach, afterAll, afterEach, expect, it, vi } from "vitest"
import { randomUUID } from "node:crypto"
import { readFile } from "node:fs/promises"
import { PGlite } from "@electric-sql/pglite"
import { btree_gist } from "@electric-sql/pglite/contrib/btree_gist"
import { drizzle } from "drizzle-orm/pglite"
import * as schema from "@/drizzle/schema"

const mocks = vi.hoisted(() => ({ busy: vi.fn(), calendar: vi.fn(), auth: vi.fn() }))
vi.mock("@/drizzle/db", () => ({ get db() { return Object.assign(database, {
  batch: async (statements: Array<{ toSQL: () => { sql: string; params: unknown[] } }>) => pg.transaction(async transaction => {
    for (const statement of statements) {
      const query = statement.toSQL()
      await transaction.query(query.sql, query.params)
    }
  }),
}) } }))
vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("@/server/google/googleCalendar", () => ({ getCalendarEventTimes: mocks.busy, createCalendarEvent: mocks.calendar }))
import { createMeeting } from "@/server/actions/meetings"
import { saveSchedule } from "@/server/actions/schedule"
import { updateEvent, deleteEvent } from "@/server/actions/events"
import { updateCurrentUserProfile } from "@/server/actions/profiles"
import { getBookingReceipt } from "@/server/queries/bookings"

const pg = new PGlite({ extensions: { btree_gist } })
const database = drizzle(pg, { schema })
const owner = "user_demo"
let eventId: string
const time = new Date(Date.now() + 86400000 * 2)
time.setUTCHours(10, 0, 0, 0)
const request = () => ({ requestId: randomUUID(), eventId, clerkUserId: owner,
  startTime: time, timezone: "Asia/Bangkok", guestName: "Guest", guestEmail: "guest@example.com" })

beforeAll(async () => {
  const journal = JSON.parse(await readFile("drizzle/migrations/meta/_journal.json", "utf8"))
  for (const entry of journal.entries) {
    const migration = await readFile(`drizzle/migrations/${entry.tag}.sql`, "utf8")
    await pg.exec(migration)
  }
}, 30000)
afterAll(async () => { await pg.close() })
afterEach(() => vi.unstubAllEnvs())
beforeEach(async () => {
  vi.clearAllMocks()
  vi.stubEnv("KALENDER_BOOKING_MODE", "demo")
  vi.stubEnv("KALENDER_DEMO_HOST_CLERK_USER_ID", owner)
  mocks.auth.mockResolvedValue({ userId: "user_tester" })
  mocks.busy.mockResolvedValue([])
  mocks.calendar.mockImplementation(async (data: { calendarEventId: string }) => ({ id: data.calendarEventId }))
  await pg.exec('TRUNCATE "bookingReservations", "bookings", "events", "schedules", "userProfiles" CASCADE')
  const [event] = await database.insert(schema.EventTable).values({ name: "Demo", slug: "demo", clerkUserId: owner,
    durationInMinutes: 30, bufferMinutes: 15, location: "Online", visibility: "public" }).returning()
  eventId = event.id
  const [schedule] = await database.insert(schema.ScheduleTable).values({ clerkUserId: owner, timezone: "UTC" }).returning()
  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const
  await database.insert(schema.ScheduleAvailabilityTable).values({ scheduleId: schedule.id,
    dayOfWeek: weekdays[time.getUTCDay()], startTime: "09:00", endTime: "17:00" })
})

it("migrates a fresh PostgreSQL database and confirms the selected UTC instant", async () => {
  const data = request()
  expect(await createMeeting(data)).toEqual({ bookingId: data.requestId })
  const booking = await database.query.BookingTable.findFirst()
  expect(booking?.startTime).toEqual(time)
  expect(booking?.timezone).toBe("Asia/Bangkok")
  const receipt = await getBookingReceipt(data.requestId, owner)
  expect(receipt).not.toHaveProperty("guestEmail")
  expect(await getBookingReceipt(data.requestId, "other-owner")).toBeUndefined()
  expect(await createMeeting(data)).toEqual({ bookingId: data.requestId })
  expect(mocks.calendar).toHaveBeenCalledTimes(1)
})
it("blocks private, past, off-grid and out-of-horizon submissions", async () => {
  await pg.exec('UPDATE events SET visibility = \'private\'')
  expect(await createMeeting(request())).toHaveProperty("error")
  await pg.exec('UPDATE events SET visibility = \'public\'')
  for (const startTime of [new Date(Date.now() - 60000), new Date(time.getTime() + 60000), new Date(Date.now() + 86400000 * 62)]) {
    expect(await createMeeting({ ...request(), startTime })).toHaveProperty("error")
  }
  expect(mocks.calendar).not.toHaveBeenCalled()
})
it("allows only one of two overlapping submissions, including different event types", async () => {
  const [other] = await database.insert(schema.EventTable).values({ name: "Other", clerkUserId: owner, durationInMinutes: 60 }).returning()
  const results = await Promise.all([createMeeting(request()), createMeeting({ ...request(), eventId: other.id })])
  expect(results.filter(result => "bookingId" in result)).toHaveLength(1)
  expect(await database.query.BookingTable.findMany()).toHaveLength(1)
  expect(await database.query.BookingReservationTable.findMany()).toHaveLength(1)
})
it("retains uncertain reservations and retries with the same provider id", async () => {
  const data = request()
  mocks.calendar.mockRejectedValueOnce(new Error("response lost"))
  expect(await createMeeting(data)).toHaveProperty("error")
  expect(await database.query.BookingReservationTable.findMany()).toHaveLength(1)
  expect(await database.query.BookingTable.findMany()).toHaveLength(0)
  expect(await createMeeting({ ...data, guestEmail: "changed@example.com" })).toHaveProperty("error")
  expect(await createMeeting(data)).toEqual({ bookingId: data.requestId })
  expect(mocks.calendar.mock.calls[0][0].calendarEventId).toBe(mocks.calendar.mock.calls[1][0].calendarEventId)
})
it("fails closed for Calendar lookup failures", async () => {
  mocks.busy.mockRejectedValue(new Error("Calendar unavailable"))
  expect(await createMeeting(request())).toHaveProperty("error")
  expect(mocks.calendar).not.toHaveBeenCalled()
})
it("prevents unauthenticated and cross-owner event/profile mutations", async () => {
  const values = { name: "Changed", durationInMinutes: 30, location: "Online", bufferMinutes: 0, visibility: "public" as const, isActive: true }
  await expect(updateEvent(eventId, values)).rejects.toThrow()
  await expect(deleteEvent(eventId)).rejects.toThrow()
  mocks.auth.mockResolvedValue({ userId: null })
  await expect(updateEvent(eventId, values)).rejects.toThrow()
  await expect(updateCurrentUserProfile({ displayName: "Changed", handle: "changed", timezone: "UTC", accent: "lime" })).rejects.toThrow()
  expect((await database.query.EventTable.findFirst())?.name).toBe("Demo")
})

it.each([undefined, "disabled", "testers", "unknown"])("blocks writes for mode %s, including the retired tester allowlist", async mode => {
  vi.stubEnv("KALENDER_BOOKING_MODE", mode)
  vi.stubEnv("KALENDER_DEMO_BOOKER_IDS", "user_tester")
  expect(await createMeeting(request())).toHaveProperty("error")
  expect(mocks.busy).not.toHaveBeenCalled()
  expect(mocks.calendar).not.toHaveBeenCalled()
  expect(await database.query.BookingReservationTable.findMany()).toHaveLength(0)
})

it.each([undefined, "", "   ", "another-host"])("blocks writes when the configured demo host is %s", async hostId => {
  vi.stubEnv("KALENDER_DEMO_HOST_CLERK_USER_ID", hostId)
  expect(await createMeeting(request())).toHaveProperty("error")
  expect(mocks.busy).not.toHaveBeenCalled()
  expect(mocks.calendar).not.toHaveBeenCalled()
  expect(await database.query.BookingReservationTable.findMany()).toHaveLength(0)
})

it("requires sign-in before any Calendar lookup or reservation", async () => {
  mocks.auth.mockResolvedValue({ userId: null })
  expect(await createMeeting(request())).toEqual({ error: "Sign in to try a booking with the demo host." })
  expect(mocks.busy).not.toHaveBeenCalled()
  expect(mocks.calendar).not.toHaveBeenCalled()
  expect(await database.query.BookingReservationTable.findMany()).toHaveLength(0)
})

it.each(["user_shared_demo", "user_new_visitor"])("lets %s book the demo host using an independently entered guest email", async userId => {
  mocks.auth.mockResolvedValue({ userId })
  const data = request()
  expect(await createMeeting(data)).toEqual({ bookingId: data.requestId })
  expect(mocks.calendar).toHaveBeenCalledWith(expect.objectContaining({
    clerkUserId: owner, guestEmail: data.guestEmail, isDemoBooking: true,
  }))
})

it("rejects another host's event even when the caller spoofs the configured host ID", async () => {
  const [other] = await database.insert(schema.EventTable).values({
    name: "Other host", clerkUserId: "another-host", durationInMinutes: 30, visibility: "public",
  }).returning()
  expect(await createMeeting({ ...request(), eventId: other.id, clerkUserId: "another-host" })).toHaveProperty("error")
  expect(await createMeeting({ ...request(), eventId: other.id })).toHaveProperty("error")
  expect(mocks.busy).not.toHaveBeenCalled()
  expect(mocks.calendar).not.toHaveBeenCalled()
  expect(await database.query.BookingReservationTable.findMany()).toHaveLength(0)
})

it("rechecks host configuration before retrying an uncertain reservation", async () => {
  const data = request()
  mocks.calendar.mockRejectedValueOnce(new Error("response lost"))
  expect(await createMeeting(data)).toHaveProperty("error")
  vi.stubEnv("KALENDER_DEMO_HOST_CLERK_USER_ID", "another-host")
  expect(await createMeeting(data)).toHaveProperty("error")
  expect(mocks.calendar).toHaveBeenCalledTimes(1)
  expect(await database.query.BookingReservationTable.findMany()).toHaveLength(1)
})

it("saves availability and timezone together, scoped to the authenticated owner", async () => {
  const values = { timezone: "Asia/Bangkok", availabilities: [
    { dayOfWeek: "monday" as const, startTime: "09:00", endTime: "12:00" },
  ] }
  await saveSchedule(values)
  const own = await database.query.ScheduleTable.findFirst({
    where: (table, { eq }) => eq(table.clerkUserId, "user_tester"), with: { availabilities: true },
  })
  expect(own?.timezone).toBe("Asia/Bangkok")
  expect(own?.availabilities).toHaveLength(1)
  expect((await database.query.ScheduleTable.findFirst({ where: (table, { eq }) => eq(table.clerkUserId, owner) }))?.timezone).toBe("UTC")
  // Force a database-side insert failure after the timezone update/delete.
  await pg.exec(`ALTER TABLE "scheduleAvailabilities" ADD CONSTRAINT "testWindow" CHECK ("startTime" <> '10:00')`)
  await expect(saveSchedule({ timezone: "Europe/London", availabilities: [
    { dayOfWeek: "monday", startTime: "10:00", endTime: "12:00" },
  ] })).rejects.toThrow()
  const retained = await database.query.ScheduleTable.findFirst({
    where: (table, { eq }) => eq(table.clerkUserId, "user_tester"), with: { availabilities: true },
  })
  expect(retained?.timezone).toBe("Asia/Bangkok")
  expect(retained?.availabilities[0].startTime).toBe("09:00")
  await pg.exec('ALTER TABLE "scheduleAvailabilities" DROP CONSTRAINT "testWindow"')
})

it("keeps a reservation when local persistence fails after Calendar success", async () => {
  const data = request()
  await pg.exec(`ALTER TABLE "bookings" ADD CONSTRAINT "testPersistenceFailure" CHECK ("guestName" <> 'Guest')`)
  expect(await createMeeting(data)).toHaveProperty("error")
  expect(await database.query.BookingTable.findMany()).toHaveLength(0)
  expect(await database.query.BookingReservationTable.findMany()).toHaveLength(1)
  await pg.exec('ALTER TABLE "bookings" DROP CONSTRAINT "testPersistenceFailure"')
  expect(await createMeeting(data)).toEqual({ bookingId: data.requestId })
  expect(mocks.calendar.mock.calls[0][0].calendarEventId).toBe(mocks.calendar.mock.calls[1][0].calendarEventId)
})
