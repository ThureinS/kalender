import { beforeEach, describe, expect, it, vi } from "vitest"

const clerk = vi.hoisted(() => ({ auth: vi.fn(), currentUser: vi.fn(), getUser: vi.fn(), updateUserMetadata: vi.fn() }))
vi.mock("@clerk/nextjs/server", () => ({
  auth: clerk.auth,
  currentUser: clerk.currentUser,
  clerkClient: async () => ({ users: { getUser: clerk.getUser, updateUserMetadata: clerk.updateUserMetadata } }),
}))

import { rememberCalendarConnection, shouldRestoreCalendarConnection } from "@/server/actions/calendarConnection"
import { calendarRestoreAttemptKey, claimCalendarRestoreAttempt, needsCalendarRestore } from "@/lib/calendar-restore"
import { requiredGoogleCalendarScopes } from "@/lib/setup-readiness"

const google = { id: "google-account", provider: "google", approvedScopes: requiredGoogleCalendarScopes.join(" ") }

beforeEach(() => vi.resetAllMocks())

describe("remembering a verified host connection", () => {
  it("rejects anonymous calls without writing metadata", async () => {
    clerk.currentUser.mockResolvedValue(null)
    await expect(rememberCalendarConnection()).rejects.toThrow("Sign in")
    expect(clerk.updateUserMetadata).not.toHaveBeenCalled()
  })

  it.each([
    [],
    [{ ...google, approvedScopes: "openid email profile" }],
    [{ ...google, approvedScopes: requiredGoogleCalendarScopes[0] }],
    [{ ...google, provider: "github" }],
  ])("does not opt in callers without both Google Calendar scopes: %j", async (...accounts) => {
    clerk.currentUser.mockResolvedValue({ id: "guest", publicMetadata: {}, externalAccounts: accounts })
    expect(await rememberCalendarConnection()).toBe(false)
    expect(clerk.updateUserMetadata).not.toHaveBeenCalled()
  })

  it("stores only the authenticated user's verified account ID", async () => {
    clerk.currentUser.mockResolvedValue({ id: "authenticated-host", publicMetadata: { otherSetting: true }, externalAccounts: [google] })
    expect(await rememberCalendarConnection()).toBe(true)
    expect(clerk.updateUserMetadata).toHaveBeenCalledExactlyOnceWith("authenticated-host", {
      publicMetadata: { kalenderCalendarAccountId: "google-account" },
    })
  })

  it("avoids writes for an already remembered connection", async () => {
    clerk.currentUser.mockResolvedValue({ id: "host", publicMetadata: { kalenderCalendarAccountId: google.id }, externalAccounts: [google] })
    expect(await rememberCalendarConnection()).toBe(true)
    expect(clerk.updateUserMetadata).not.toHaveBeenCalled()
  })
})

describe("automatic recovery boundaries", () => {
  const identityOnly = { ...google, approvedScopes: "openid email profile" }

  it("reads the authenticated server record when the browser has stale metadata", async () => {
    clerk.auth.mockResolvedValue({ userId: "host" })
    clerk.getUser.mockResolvedValue({ publicMetadata: { kalenderCalendarAccountId: google.id }, externalAccounts: [identityOnly] })
    expect(await shouldRestoreCalendarConnection()).toBe(true)
    expect(clerk.getUser).toHaveBeenCalledExactlyOnceWith("host")
  })

  it.each([
    { publicMetadata: {}, externalAccounts: [identityOnly] },
    { publicMetadata: { kalenderCalendarAccountId: google.id }, externalAccounts: [google] },
    { publicMetadata: { kalenderCalendarAccountId: google.id }, externalAccounts: [{ ...identityOnly, id: "different" }] },
  ])("does not restore an unapproved, already connected, or replacement account: %j", async record => {
    clerk.auth.mockResolvedValue({ userId: "host" })
    clerk.getUser.mockResolvedValue(record)
    expect(await shouldRestoreCalendarConnection()).toBe(false)
  })

  it("does not read another user without an authenticated session", async () => {
    clerk.auth.mockResolvedValue({ userId: null })
    expect(await shouldRestoreCalendarConnection()).toBe(false)
    expect(clerk.getUser).not.toHaveBeenCalled()
  })

  it("restores a previously opted-in account only when its grant is missing", () => {
    expect(needsCalendarRestore(google.id, identityOnly)).toBe(true)
    expect(needsCalendarRestore(google.id, google)).toBe(false)
    expect(needsCalendarRestore(undefined, identityOnly)).toBe(false)
    expect(needsCalendarRestore(google.id, undefined)).toBe(false)
    expect(needsCalendarRestore(google.id, { ...identityOnly, id: "replacement-account" })).toBe(false)
    expect(needsCalendarRestore(true, identityOnly)).toBe(false)
  })

  it("allows one attempt per session/account, surviving redirect and remount", () => {
    const values = new Map<string, string>()
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
    const key = calendarRestoreAttemptKey("session-1", google.id)
    expect(claimCalendarRestoreAttempt(storage, key)).toBe(true)
    expect(claimCalendarRestoreAttempt(storage, key)).toBe(false)
    expect(claimCalendarRestoreAttempt(storage, calendarRestoreAttemptKey("session-2", google.id))).toBe(true)
    expect(claimCalendarRestoreAttempt(storage, calendarRestoreAttemptKey("session-1", "another-account"))).toBe(true)
  })

  it("does not auto-redirect when browser storage cannot retain the loop guard", () => {
    const storage = { getItem: () => null, setItem: () => { throw new Error("Storage blocked") } }
    expect(claimCalendarRestoreAttempt(storage, "attempt")).toBe(false)
  })
})
