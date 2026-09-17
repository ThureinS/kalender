import "server-only"
import { clerkClient } from "@clerk/nextjs/server"
import { addMinutes } from "date-fns"
import { calendar_v3, google } from "googleapis"

async function getOAuthClient(clerkUserId: string) {
  const client = await clerkClient()
  const { data } = await client.users.getUserOauthAccessToken(clerkUserId, "google")
  if (!data[0]?.token) throw new Error("Calendar authorization unavailable")
  // Clerk owns the OAuth exchange/refresh; only its access token is needed here.
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: data[0].token })
  return auth
}

export function parseBusyResponse(data: calendar_v3.Schema$FreeBusyResponse) {
  const primary = data.calendars?.primary
  if (!primary || primary.errors?.length || !Array.isArray(primary.busy)) {
    throw new Error("Calendar availability unavailable")
  }
  return primary.busy.map(interval => {
    const start = new Date(interval.start ?? "")
    const end = new Date(interval.end ?? "")
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
      throw new Error("Invalid Calendar interval")
    }
    return { start, end }
  })
}

export async function getCalendarEventTimes(clerkUserId: string, { start, end }: { start: Date; end: Date }) {
  const auth = await getOAuthClient(clerkUserId)
  const response = await google.calendar("v3").freebusy.query({ auth,
    requestBody: { timeMin: start.toISOString(), timeMax: end.toISOString(), items: [{ id: "primary" }] },
  }, { timeout: 15000, retry: false })
  // Fail closed in every environment, including HTTP-200 per-calendar errors.
  return parseBusyResponse(response.data)
}

function statusCode(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error ? Number(error.code) : undefined
}

export async function createCalendarEvent({ clerkUserId, calendarEventId, guestName, guestEmail,
  startTime, guestNotes, durationInMinutes, eventName, eventLocation,
}: {
  clerkUserId: string; calendarEventId: string; guestName: string; guestEmail: string
  startTime: Date; guestNotes?: string | null; durationInMinutes: number
  eventName: string; eventLocation?: string | null
}): Promise<calendar_v3.Schema$Event> {
  const auth = await getOAuthClient(clerkUserId)
  const calendar = google.calendar("v3")
  const lookup = async () => {
    const result = await calendar.events.get({ calendarId: "primary", eventId: calendarEventId, auth }, { timeout: 15000, retry: false })
    if (!result.data.id || result.data.status === "cancelled") throw new Error("Calendar event unavailable")
    return result.data
  }
  try {
    return await lookup()
  } catch (error) {
    if (statusCode(error) !== 404) throw error
  }
  try {
    const result = await calendar.events.insert({ calendarId: "primary", auth, sendUpdates: "all",
      requestBody: { id: calendarEventId,
        attendees: [{ email: guestEmail, displayName: guestName }],
        description: guestNotes || undefined,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: addMinutes(startTime, durationInMinutes).toISOString() },
        summary: `${guestName}: ${eventName}`, location: eventLocation || undefined,
      },
    }, { timeout: 15000, retry: false })
    return result.data
  } catch (error) {
    // A concurrent retry may have inserted the same deterministic id.
    if (statusCode(error) === 409) return lookup()
    throw error
  }
}
