import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const clerk = vi.hoisted(() => ({ auth: vi.fn(), getUser: vi.fn(), mint: vi.fn() }))
vi.mock("@clerk/nextjs/server", () => ({
  auth: clerk.auth,
  clerkClient: async () => ({ users: { getUser: clerk.getUser }, signInTokens: { createSignInToken: clerk.mint } }),
}))

import { createDemoVisitorSignIn } from "@/server/actions/demoVisitorSignIn"
import { getDemoVisitorTicketConfig } from "@/server/demoVisitorAccess"

const ids = ["user_visitor111111111", "user_visitor222222222", "user_visitor333333333"]
const liveHost = "user_3JrIeUQShpAMZwP80zXs22uXBi7"
function configure(live = true) {
  const domain = live ? "clerk.kalender-tau.vercel.app$" : "included-garfish-63.clerk.accounts.dev$"
  vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", `${live ? "pk_live_" : "pk_test_"}${Buffer.from(domain).toString("base64")}`)
  vi.stubEnv("KALENDER_BOOKING_MODE", "disabled")
  vi.stubEnv("KALENDER_DEMO_HOST_CLERK_USER_ID", live ? liveHost : "user_3Im9W7uEWVIJYnoULDo0EIvCM23")
  vi.stubEnv("KALENDER_DEMO_VISITOR_USER_IDS", ids.join(","))
  vi.stubEnv("KALENDER_DEMO_PROFILE_HANDLE", "demo-portfolio-studio")
}
function visitor(index = 0) {
  return { id: ids[index], externalId: `kalender-public-demo-visitor-${index + 1}`,
    privateMetadata: { kalenderDemoVisitor: true, kalenderDemoVisitorIndex: index },
    emailAddresses: [], externalAccounts: [], banned: false, locked: false }
}

beforeEach(() => {
  vi.resetAllMocks()
  configure()
  clerk.auth.mockResolvedValue({ userId: null })
  clerk.getUser.mockResolvedValue(visitor())
  clerk.mint.mockResolvedValue({ token: "one-time-ticket" })
})
afterEach(() => vi.unstubAllEnvs())

describe("public demo sign-in boundaries", () => {
  it.each([
    ["KALENDER_BOOKING_MODE", "live"],
    ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_live_d3JvbmcuZXhhbXBsZSQ="],
    ["KALENDER_DEMO_HOST_CLERK_USER_ID", "user_wronghost111111"],
    ["KALENDER_DEMO_VISITOR_USER_IDS", ""],
    ["KALENDER_DEMO_VISITOR_USER_IDS", `${ids[0]},${ids[0]},${ids[2]}`],
    ["KALENDER_DEMO_VISITOR_USER_IDS", `${ids[0]},${liveHost},${ids[2]}`],
  ])("fails closed for invalid %s configuration", async (key, value) => {
    vi.stubEnv(key, value)
    expect(getDemoVisitorTicketConfig()).toBeNull()
    expect(await createDemoVisitorSignIn(0)).toHaveProperty("error")
    expect(clerk.getUser).not.toHaveBeenCalled()
    expect(clerk.mint).not.toHaveBeenCalled()
  })

  it.each([-1, 3, 0.5, NaN, "0", ids[0]])("rejects untrusted account selectors: %s", async value => {
    expect(await createDemoVisitorSignIn(value as number)).toHaveProperty("error")
    expect(clerk.mint).not.toHaveBeenCalled()
  })

  it.each([
    { privateMetadata: {} },
    { privateMetadata: { kalenderDemoVisitor: true, kalenderDemoVisitorIndex: 1 } },
    { id: liveHost },
    { externalId: "another-identity" },
    { externalAccounts: [{ provider: "google" }] },
    { emailAddresses: [{ emailAddress: "real-owner@example.com" }] },
    { banned: true },
    { locked: true },
  ])("does not mint access for an unsafe or changed account: %j", async changes => {
    clerk.getUser.mockResolvedValue({ ...visitor(), ...changes })
    expect(await createDemoVisitorSignIn(0)).toHaveProperty("error")
    expect(clerk.mint).not.toHaveBeenCalled()
  })

  it.each([0, 1, 2])("mints a 60-second ticket only for configured visitor %s", async index => {
    clerk.getUser.mockResolvedValue(visitor(index))
    expect(await createDemoVisitorSignIn(index)).toEqual({ ticket: "one-time-ticket", bookingPath: "/book/demo-portfolio-studio/portfolio-review" })
    expect(clerk.getUser).toHaveBeenCalledExactlyOnceWith(ids[index])
    expect(clerk.mint).toHaveBeenCalledExactlyOnceWith({ userId: ids[index], expiresInSeconds: 60 })
  })

  it("preserves an existing signed-in identity", async () => {
    clerk.auth.mockResolvedValue({ userId: "real-visitor" })
    expect(await createDemoVisitorSignIn(0)).toHaveProperty("alreadySignedIn", true)
    expect(clerk.getUser).not.toHaveBeenCalled()
    expect(clerk.mint).not.toHaveBeenCalled()
  })

  it("allows only that development visitor's test addresses", async () => {
    configure(false)
    clerk.getUser.mockResolvedValue({ ...visitor(), emailAddresses: [
      { emailAddress: "demo-tester-1+clerk_test@example.com" }, { emailAddress: "demo-tester-1@example.com" },
    ] })
    expect(await createDemoVisitorSignIn(0)).toHaveProperty("ticket")
    clerk.mint.mockClear()
    clerk.getUser.mockResolvedValue({ ...visitor(), emailAddresses: [{ emailAddress: "demo-tester-2@example.com" }] })
    expect(await createDemoVisitorSignIn(0)).toHaveProperty("error")
    expect(clerk.mint).not.toHaveBeenCalled()
  })

  it("returns a generic error without provider details", async () => {
    clerk.mint.mockRejectedValue(new Error("provider credentials and internal details"))
    expect(await createDemoVisitorSignIn(0)).toEqual({ error: "We could not start demo sign-in. Please try again shortly." })
  })
})
