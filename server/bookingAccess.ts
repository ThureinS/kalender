import "server-only"
import { auth } from "@clerk/nextjs/server"

export async function canCreateBooking() {
  if (process.env.KALENDER_BOOKING_MODE !== "testers") return false
  const approvedIds = (process.env.KALENDER_DEMO_BOOKER_IDS ?? "").split(",").map(id => id.trim()).filter(Boolean)
  if (!approvedIds.length) return false
  const { userId } = await auth()
  return Boolean(userId && approvedIds.includes(userId))
}
