type ProfileIdentity = {
  displayName?: string | null
  handle?: string | null
}

type ScheduleWithAvailability = {
  availabilities?: Array<unknown> | null
} | null | undefined

type EventVisibility = {
  isActive: boolean
  visibility?: string | null
}

type GoogleConnection = {
  provider?: string | null
  approvedScopes?: string | null
} | null | undefined

export const requiredGoogleCalendarScopes = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.events.freebusy",
] as const

export function isGoogleConnection(
  account: { provider?: string | null } | null | undefined
) {
  return account?.provider === "google" || account?.provider === "oauth_google"
}

export function hasGoogleCalendarScopes(googleAccount: GoogleConnection) {
  const approvedScopes = googleAccount?.approvedScopes?.split(" ") ?? []

  return Boolean(
    approvedScopes.length > 0 &&
      requiredGoogleCalendarScopes.every(requiredScope =>
        approvedScopes.includes(requiredScope)
      )
  )
}

export function getPublicActiveEvents<T extends EventVisibility>(events: T[]) {
  return events.filter(
    event => event.isActive && event.visibility === "public"
  )
}

export function hasSavedAvailability(schedule: ScheduleWithAvailability) {
  return Boolean(schedule?.availabilities && schedule.availabilities.length > 0)
}

export function hasProfileIdentity(profile: ProfileIdentity | null | undefined) {
  return Boolean(profile?.displayName && profile.handle)
}

export function getSetupReadiness<T extends EventVisibility>({
  profile,
  schedule,
  events,
  googleAccount,
}: {
  profile: ProfileIdentity | null | undefined
  schedule: ScheduleWithAvailability
  events: T[]
  googleAccount: GoogleConnection
}) {
  const publicActiveEvents = getPublicActiveEvents(events)
  const items = {
    profileIdentity: hasProfileIdentity(profile),
    availability: hasSavedAvailability(schedule),
    publicEvent: publicActiveEvents.length > 0,
    googleCalendar: hasGoogleCalendarScopes(googleAccount),
  }

  return {
    ...items,
    publicActiveEvents,
    completedCount: Object.values(items).filter(Boolean).length,
    totalCount: Object.values(items).length,
    readyToShare: Object.values(items).every(Boolean),
  }
}
