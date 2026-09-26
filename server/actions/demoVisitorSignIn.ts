"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { getDemoVisitorAccess, getDemoVisitorTicketConfig } from "@/server/demoVisitorAccess"

export async function createDemoVisitorSignIn(index: number) {
  const config = getDemoVisitorTicketConfig()
  const access = getDemoVisitorAccess()
  if (!config || !access || !Number.isInteger(index) || index < 0 || index >= config.ids.length) {
    return { error: "Demo sign-in is unavailable." } as const
  }
  const { userId } = await auth()
  if (userId) return { alreadySignedIn: true, bookingPath: access.bookingPath } as const
  try {
    const client = await clerkClient()
    const id = config.ids[index]
    const user = await client.users.getUser(id)
    // IDs come only from server configuration, never from the request. Private
    // metadata is set by provisioning and cannot be changed by these visitors.
    // Refuse accounts that have since been linked to a real identity/calendar.
    const emailsAreDemoOnly = config.isLive ? user.emailAddresses.length === 0
      : user.emailAddresses.every(email => [
        `demo-tester-${index + 1}@example.com`,
        `demo-tester-${index + 1}+clerk_test@example.com`,
      ].includes(email.emailAddress))
    if (user.id !== id || user.privateMetadata.kalenderDemoVisitor !== true ||
        user.privateMetadata.kalenderDemoVisitorIndex !== index || user.externalAccounts.length ||
        !emailsAreDemoOnly || user.banned || user.locked ||
        (config.isLive && user.externalId !== `kalender-public-demo-visitor-${index + 1}`)) {
      return { error: "This shared demo account is unavailable." } as const
    }
    const { token } = await client.signInTokens.createSignInToken({ userId: id, expiresInSeconds: 60 })
    return { ticket: token, bookingPath: access.bookingPath } as const
  } catch {
    // Never log or persist the ticket, raw Clerk errors or user details.
    return { error: "We could not start demo sign-in. Please try again shortly." } as const
  }
}
