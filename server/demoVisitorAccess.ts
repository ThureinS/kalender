import "server-only"
import { getDemoProfilePath } from "@/server/demoBookingPage"

// Intentionally shared visitor credentials, authorized for the portfolio demo.
// Never substitute host credentials or service keys here.
const demoVisitorAccess = {
  "emails": [
    "demo-tester-1+clerk_test@example.com",
    "demo-tester-2+clerk_test@example.com",
    "demo-tester-3+clerk_test@example.com"
  ],
  "password": "Aa9!Tv__ZajQ_8U4xfxuDWMYcqbU",
  "verificationCode": "424242"
}

export function getDemoVisitorAccess() {
  const ticketConfig = getDemoVisitorTicketConfig()
  if (ticketConfig) return {
    kind: "ticket" as const,
    visitorCount: ticketConfig.ids.length,
    bookingPath: `${getDemoProfilePath()}/portfolio-review`,
    bookingsEnabled: process.env.KALENDER_BOOKING_MODE === "demo",
  }
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ""
  if (process.env.KALENDER_BOOKING_MODE !== "demo" ||
      process.env.KALENDER_DEMO_HOST_CLERK_USER_ID !== "user_3Im9W7uEWVIJYnoULDo0EIvCM23" ||
      !key.startsWith("pk_test_")) return null

  const domain = Buffer.from(key.slice("pk_test_".length), "base64").toString("utf8")
  if (domain !== "included-garfish-63.clerk.accounts.dev$") return null
  return { ...demoVisitorAccess, kind: "password" as const,
    bookingPath: `${getDemoProfilePath()}/portfolio-review`, bookingsEnabled: true }
}

export function getDemoVisitorTicketConfig() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ""
  const prefix = key.startsWith("pk_live_") ? "pk_live_" : key.startsWith("pk_test_") ? "pk_test_" : null
  const mode = process.env.KALENDER_BOOKING_MODE
  if (!prefix || !["demo", "disabled"].includes(mode ?? "")) return null
  const domain = Buffer.from(key.slice(prefix.length), "base64").toString("utf8")
  const expectedHost = prefix === "pk_live_" && domain === "clerk.kalender-tau.vercel.app$"
    ? "user_3JrIeUQShpAMZwP80zXs22uXBi7"
    : prefix === "pk_test_" && domain === "included-garfish-63.clerk.accounts.dev$"
      ? "user_3Im9W7uEWVIJYnoULDo0EIvCM23" : null
  if (!expectedHost || process.env.KALENDER_DEMO_HOST_CLERK_USER_ID !== expectedHost) return null
  const ids = (process.env.KALENDER_DEMO_VISITOR_USER_IDS ?? "").split(",").map(id => id.trim())
  if (ids.length !== 3 || new Set(ids).size !== 3 ||
      ids.some(id => !/^user_[a-zA-Z0-9]{12,64}$/.test(id) || id === expectedHost)) return null
  return { ids, isLive: prefix === "pk_live_" }
}
