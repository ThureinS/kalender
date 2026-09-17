import { describe, expect, it } from "vitest"
import { candidateTimes, conflictRange, withoutConflicts } from "@/lib/availability"
import { timezoneSchema } from "@/schema/timezone"
import { meetingActionSchema } from "@/schema/meetings"
import { scheduleFormSchema } from "@/schema/schedule"
import { getSetupReadiness, requiredGoogleCalendarScopes } from "@/lib/setup-readiness"

const iso = (values: Date[]) => values.map(value => value.toISOString())
describe("availability", () => {
  it("uses the owner's date across UTC midnight, including a single-slot query", () => {
    const instant = new Date("2030-01-06T18:30:00Z") // Monday 01:30 Bangkok
    expect(iso(candidateTimes({ start: instant, end: instant, timezone: "Asia/Bangkok",
      availabilities: [{ dayOfWeek: "monday", startTime: "01:00", endTime: "02:00" }], durationInMinutes: 30,
    }))).toEqual([instant.toISOString()])
  })
  it("handles spring DST and never spills beyond a weekly window", () => {
    expect(iso(candidateTimes({ start: new Date("2030-03-10T00:00:00Z"), end: new Date("2030-03-11T00:00:00Z"),
      timezone: "America/New_York", durationInMinutes: 30,
      availabilities: [{ dayOfWeek: "sunday", startTime: "01:30", endTime: "03:30" }],
    }))).toEqual(["2030-03-10T06:30:00.000Z", "2030-03-10T06:45:00.000Z", "2030-03-10T07:00:00.000Z"])
  })
  it("keeps both repeated fall DST instants distinct", () => {
    const values = candidateTimes({ start: new Date("2030-11-03T00:00:00Z"), end: new Date("2030-11-04T00:00:00Z"),
      timezone: "America/New_York", durationInMinutes: 30,
      availabilities: [{ dayOfWeek: "sunday", startTime: "00:30", endTime: "02:30" }],
    })
    expect(iso(values)).toContain("2030-11-03T05:30:00.000Z")
    expect(iso(values)).toContain("2030-11-03T06:30:00.000Z")
  })
  it("queries duration plus both buffers and permits exact adjacency", () => {
    const time = new Date("2030-01-07T10:00:00Z")
    expect(conflictRange(time, 30, 15)).toEqual({ start: new Date("2030-01-07T09:45:00Z"), end: new Date("2030-01-07T10:45:00Z") })
    expect(withoutConflicts([time], [{ start: new Date("2030-01-07T10:40:00Z"), end: new Date("2030-01-07T11:00:00Z") }], 30, 15)).toEqual([])
    expect(withoutConflicts([time], [{ start: new Date("2030-01-07T10:45:00Z"), end: new Date("2030-01-07T11:00:00Z") }], 30, 15)).toEqual([time])
  })
  it("rejects off-grid and too-short windows", () => {
    const time = new Date("2030-01-07T10:01:00Z")
    expect(candidateTimes({ start: time, end: time, timezone: "UTC", durationInMinutes: 30,
      availabilities: [{ dayOfWeek: "monday", startTime: "10:00", endTime: "11:00" }],
    })).toEqual([])
  })
})

it("validates zones, guest limits and overlapping availability", () => {
  expect(timezoneSchema.safeParse("UTC").success).toBe(true)
  expect(timezoneSchema.safeParse("Made/Up").success).toBe(false)
  expect(meetingActionSchema.safeParse({ guestName: " ", guestNotes: "x".repeat(2001) }).success).toBe(false)
  expect(scheduleFormSchema.safeParse({ timezone: "UTC", availabilities: [
    { dayOfWeek: "monday", startTime: "09:00", endTime: "11:00" },
    { dayOfWeek: "monday", startTime: "10:00", endTime: "12:00" },
  ] }).success).toBe(false)
})

it("requires explicit availability and both Google scopes before launch", () => {
  const setup = { profile: { displayName: "Host", handle: "host" },
    schedule: { availabilities: [] }, events: [{ isActive: true, visibility: "private" }],
    googleAccount: { approvedScopes: requiredGoogleCalendarScopes[0] },
  }
  expect(getSetupReadiness(setup).readyToShare).toBe(false)
  expect(getSetupReadiness({ ...setup, schedule: { availabilities: [{}] },
    events: [{ isActive: true, visibility: "public" }],
    googleAccount: { approvedScopes: requiredGoogleCalendarScopes.join(" ") },
  }).readyToShare).toBe(true)
})
