import { getEvent, getEventBySlug } from "@/server/actions/events"
import {
  getOrCreateProfile,
  getProfileByHandle,
  type UserProfile,
} from "@/server/actions/profiles"
import { clerkClient } from "@clerk/nextjs/server"

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isLegacyClerkUserId(value: string) {
  return value.startsWith("user_")
}

function isUuid(value: string) {
  return uuidPattern.test(value)
}

function profileSeedFromClerkUser(user: {
  id: string
  fullName: string | null
  imageUrl: string
  primaryEmailAddress?: { emailAddress: string } | null
}) {
  return {
    clerkUserId: user.id,
    displayName: user.fullName,
    avatarUrl: user.imageUrl,
    email: user.primaryEmailAddress?.emailAddress,
  }
}

export async function resolvePublicProfileSegment(segment: string): Promise<{
  profile: UserProfile | null
  isLegacySegment: boolean
}> {
  if (isLegacyClerkUserId(segment)) {
    const client = await clerkClient()
    const user = await client.users.getUser(segment).catch(() => null)

    if (!user) {
      return { profile: null, isLegacySegment: true }
    }

    const profile = await getOrCreateProfile(profileSeedFromClerkUser(user))
    return { profile, isLegacySegment: true }
  }

  const profile = await getProfileByHandle(segment)
  return { profile: profile ?? null, isLegacySegment: false }
}

export async function getCalendarUserForProfile(profile: UserProfile) {
  const client = await clerkClient()
  return client.users.getUser(profile.clerkUserId).catch(() => null)
}

export async function resolvePublicEvent(
  profile: UserProfile,
  eventSegment: string
) {
  if (isUuid(eventSegment)) {
    const event = await getEvent(profile.clerkUserId, eventSegment)

    if (!event || !event.isActive || event.visibility !== "public") {
      return null
    }

    return event
  }

  return getEventBySlug(profile.clerkUserId, eventSegment)
}

