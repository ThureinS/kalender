import { afterEach, expect, it, vi } from "vitest"

vi.mock("@clerk/nextjs/server", () => ({ clerkClient: async () => ({ users: {
  getUserOauthAccessToken: async () => ({ data: [{ token: "mock-token" }] }),
} }) }))

import { getCalendarEventTimes } from "@/server/google/googleCalendar"

afterEach(() => vi.unstubAllGlobals())

const range = { start: new Date("2030-01-07T10:00:00Z"), end: new Date("2030-01-07T11:00:00Z") }

it("uses native fetch through the real Google SDK without caching host availability", async () => {
  const transport = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
    calendars: { primary: { busy: [{ start: range.start.toISOString(), end: range.end.toISOString() }] } },
  }), { headers: { "Content-Type": "application/json" } }))
  vi.stubGlobal("fetch", transport)

  expect(await getCalendarEventTimes("host", range)).toEqual([range])
  expect(transport).toHaveBeenCalledTimes(1)
  const [url, init] = transport.mock.calls[0]
  expect(String(url)).toBe("https://www.googleapis.com/calendar/v3/freeBusy")
  expect(init?.method).toBe("POST")
  expect(init?.cache).toBe("no-store")
  expect(new Headers(init?.headers).get("authorization")).toBe("Bearer mock-token")
  expect(JSON.parse(String(init?.body))).toEqual({
    timeMin: range.start.toISOString(), timeMax: range.end.toISOString(), items: [{ id: "primary" }],
  })
})

it("fails closed on a provider outage without retrying the native transport", async () => {
  const transport = vi.fn<typeof fetch>().mockImplementation(async () => new Response(
    JSON.stringify({ error: { message: "Unavailable" } }),
    { status: 503, headers: { "Content-Type": "application/json" } },
  ))
  vi.stubGlobal("fetch", transport)

  await expect(getCalendarEventTimes("host", range)).rejects.toThrow()
  expect(transport).toHaveBeenCalledTimes(1)
})
