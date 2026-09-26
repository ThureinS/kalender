import { beforeEach, expect, it, vi } from "vitest"
const mocks = vi.hoisted(() => ({ get: vi.fn(), insert: vi.fn(), freebusy: vi.fn() }))
vi.mock("@clerk/nextjs/server", () => ({ clerkClient: async () => ({ users: {
  getUserOauthAccessToken: async () => ({ data: [{ token: "mock-token" }] }),
} }) }))
vi.mock("googleapis", () => ({ google: {
  auth: { OAuth2: class { setCredentials() {} } },
  calendar: () => ({ events: { get: mocks.get, insert: mocks.insert }, freebusy: { query: mocks.freebusy } }),
} }))
import { createCalendarEvent, getCalendarEventTimes, parseBusyResponse } from "@/server/google/googleCalendar"
const data = { clerkUserId: "host", calendarEventId: "abc123", guestName: "Guest", guestEmail: "guest@example.com",
  startTime: new Date("2030-01-07T10:00:00Z"), durationInMinutes: 30, eventName: "Consultation" }
beforeEach(() => vi.resetAllMocks())

it("rejects missing calendars, per-calendar errors and malformed intervals", () => {
  for (const payload of [{}, { calendars: { primary: { errors: [{ reason: "forbidden" }] } } },
    { calendars: { primary: { busy: [{ start: "bad", end: "bad" }] } } }]) {
    expect(() => parseBusyResponse(payload)).toThrow()
  }
  expect(parseBusyResponse({ calendars: { primary: { busy: [] } } })).toEqual([])
})
it("does not pretend Calendar is empty during an outage, even in development", async () => {
  vi.stubEnv("NODE_ENV", "development")
  mocks.freebusy.mockRejectedValue(new Error("unavailable"))
  await expect(getCalendarEventTimes("host", { start: data.startTime, end: new Date("2030-01-07T11:00:00Z") })).rejects.toThrow()
  vi.unstubAllEnvs()
})
it("reuses a provider event after a lost response without sending another invite", async () => {
  mocks.get.mockResolvedValue({ data: { id: "abc123", status: "confirmed" } })
  expect(await createCalendarEvent(data)).toHaveProperty("id", "abc123")
  expect(mocks.insert).not.toHaveBeenCalled()
})
it("requests a Google invitation for the form email and labels demo Calendar events", async () => {
  mocks.get.mockRejectedValueOnce({ code: 404 })
  mocks.insert.mockResolvedValue({ data: { id: "abc123" } })
  await createCalendarEvent({ ...data, isDemoBooking: true, guestNotes: "Trying the demo" })
  expect(mocks.insert).toHaveBeenCalledWith(expect.objectContaining({
    calendarId: "primary", sendUpdates: "all",
    requestBody: expect.objectContaining({
      attendees: [{ email: data.guestEmail, displayName: data.guestName }],
      summary: "[Demo] Guest: Consultation",
      description: "Kalender demo booking: for testing only. No meeting will take place.\n\nTrying the demo",
    }),
  }), expect.any(Object))
})
it("inserts with a deterministic id and resolves concurrent retry conflicts", async () => {
  mocks.get.mockRejectedValueOnce({ code: 404 }).mockResolvedValueOnce({ data: { id: "abc123" } })
  mocks.insert.mockRejectedValue({ code: 409 })
  expect(await createCalendarEvent(data)).toHaveProperty("id", "abc123")
  expect(mocks.insert.mock.calls[0][0].requestBody.id).toBe("abc123")
})
it("does not create a new event when a lookup fails ambiguously or returns a canceled event", async () => {
  mocks.get.mockRejectedValueOnce({ code: 503 })
  await expect(createCalendarEvent(data)).rejects.toEqual({ code: 503 })
  mocks.get.mockResolvedValueOnce({ data: { id: "abc123", status: "cancelled" } })
  await expect(createCalendarEvent(data)).rejects.toThrow()
  expect(mocks.insert).not.toHaveBeenCalled()
})
