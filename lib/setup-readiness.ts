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
  approvedScopes?: string | null
} | null | undefined

export function hasGoogleCalendarScopes(googleAccount: GoogleConnection) {
  return Boolean(
    googleAccount?.approvedScopes
      ?.split(" ")
      .some(scope => scope.includes("googleapis.com/auth/calendar"))
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
