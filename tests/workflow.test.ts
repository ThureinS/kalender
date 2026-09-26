import { expect, it, vi } from "vitest"
import { completeBooking } from "@/lib/booking-workflow"

it("does not contact Google if reserving fails", async () => {
  const create = vi.fn()
  await expect(completeBooking({ findCompleted: async () => undefined,
    reserve: async () => { throw new Error("overlap") }, createCalendarEvent: create, persist: vi.fn(),
  })).rejects.toThrow("overlap")
  expect(create).not.toHaveBeenCalled()
})
it("does not persist or report success when Google fails", async () => {
  const persist = vi.fn()
  await expect(completeBooking({ findCompleted: async () => undefined, reserve: async () => "reservation",
    createCalendarEvent: async () => { throw new Error("timeout") }, persist,
  })).rejects.toThrow("timeout")
  expect(persist).not.toHaveBeenCalled()
})
it("surfaces local persistence failure, and returns completed retries without writing", async () => {
  await expect(completeBooking({ findCompleted: async () => undefined, reserve: async () => "reservation",
    createCalendarEvent: async () => ({ id: "provider-id" }), persist: async () => { throw new Error("database offline") },
  })).rejects.toThrow("database offline")
  const reserve = vi.fn()
  expect(await completeBooking({ findCompleted: async () => "receipt", reserve, createCalendarEvent: vi.fn(), persist: vi.fn() })).toBe("receipt")
  expect(reserve).not.toHaveBeenCalled()
})
