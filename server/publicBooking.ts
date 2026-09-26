import "server-only"
import { getEvent, getEventBySlug } from "@/server/queries/events"
import {
  getProfileByClerkUserId,
  getProfileByHandle,
  type UserProfile,
} from "@/server/queries/profiles"

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isLegacyClerkUserId(value: string) {
  return value.startsWith("user_")
}

function isUuid(value: string) {
  return uuidPattern.test(value)
}

export async function resolvePublicProfileSegment(segment: string): Promise<{
  profile: UserProfile | null
  isLegacySegment: boolean
}> {
  if (isLegacyClerkUserId(segment)) {
    const profile = await getProfileByClerkUserId(segment)
    return { profile: profile ?? null, isLegacySegment: true }
  }

  const profile = await getProfileByHandle(segment)
  return { profile: profile ?? null, isLegacySegment: false }
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

