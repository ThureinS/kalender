import "server-only"
import { auth } from "@clerk/nextjs/server"

export type BookingAccess = "allowed" | "disabled" | "other-host" | "sign-in-required"

export function isDemoBookingHost(clerkUserId: string) {
  const hostId = process.env.KALENDER_DEMO_HOST_CLERK_USER_ID?.trim()
  return Boolean(hostId && clerkUserId === hostId)
}

export async function getBookingAccess(clerkUserId: string): Promise<BookingAccess> {
  // Missing configuration and the retired "testers" mode both fail closed.
  if (process.env.KALENDER_BOOKING_MODE !== "demo") return "disabled"
  if (!isDemoBookingHost(clerkUserId)) return "other-host"
  const { userId } = await auth()
  return userId ? "allowed" : "sign-in-required"
}
