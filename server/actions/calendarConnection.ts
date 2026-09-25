"use server"

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server"
import { hasGoogleCalendarScopes, isGoogleConnection } from "@/lib/setup-readiness"
import { needsCalendarRestore } from "@/lib/calendar-restore"

// Remember only an authenticated account whose grant Clerk has already verified.
// Callers cannot nominate another user/account or manufacture an approved grant.
export async function rememberCalendarConnection() {
  const user = await currentUser()
  if (!user) throw new Error("Sign in before saving a Calendar connection.")
  const account = user.externalAccounts.find(isGoogleConnection)
  if (!account || !hasGoogleCalendarScopes(account)) return false
  if (user.publicMetadata.kalenderCalendarAccountId === account.id) return true

  const client = await clerkClient()
  await client.users.updateUserMetadata(user.id, {
    publicMetadata: { kalenderCalendarAccountId: account.id },
  })
  return true
}

// Clerk's browser user can carry a pre-grant metadata snapshot after sign-in.
// Read the authenticated user's current server record before deciding to restore.
export async function shouldRestoreCalendarConnection() {
  const { userId } = await auth()
  if (!userId) return false

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const account = user.externalAccounts.find(isGoogleConnection)
  return needsCalendarRestore(user.publicMetadata.kalenderCalendarAccountId, account)
}
