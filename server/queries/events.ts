import "server-only"
import { db } from "@/drizzle/db"
import { EventTable } from "@/drizzle/schema"

  // Infer the type of a row from the EventTable schema
  type EventRow = typeof EventTable.$inferSelect

// Async function to fetch all events (active and inactive) for a specific user
export async function getEvents(clerkUserId: string): Promise<EventRow[]> {
  // Query the database for events where the clerkUserId matches
  const events = await db.query.EventTable.findMany({
    //where: — This defines a filter (a WHERE clause) for your query.

    // ({ clerkUserId: userIdCol }, { eq }) => ... — This is a destructured function:

    // clerkUserId is a variable (likely passed in earlier to the query).

    // userIdCol is a reference to a column in your database (you're just renaming clerkUserId to userIdCol for clarity).
    where: ({ clerkUserId: userIdCol }, { eq }) => eq(userIdCol, clerkUserId),

    // Events are ordered alphabetically (case-insensitive) by name
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  })

    // Return the full list of events
    return events

}

// Fetch a specific event for a given user
export async function getEvent(userId: string, eventId: string): Promise<EventRow | undefined> {
  const event = await db.query.EventTable.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) =>
      and(eq(clerkUserId, userId), eq(id, eventId)), // Make sure the event belongs to the user
  })

  return event ?? undefined // Explicitly return undefined if not found
}

export async function getEventBySlug(
  userId: string,
  eventSlug: string
): Promise<EventRow | undefined> {
  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId, isActive, slug, visibility }, { and, eq }) =>
      and(
        eq(clerkUserId, userId),
        eq(isActive, true),
        eq(visibility, "public"),
        eq(slug, eventSlug)
      ),
  })

  return event ?? undefined
}


// Define a new type for public events, which are always active
// It removes the generic 'isActive' field and replaces it with a literal true
export type PublicEvent = Omit<EventRow, "isActive"> & { isActive: true }
// “This version of an event is guaranteed to be active — no maybe, no false.”


// Async function to fetch all active (public) events for a specific user
export async function getPublicEvents(clerkUserId: string): Promise<PublicEvent[]> {
  // Query the database for events where:
  // - the clerkUserId matches
  // - the event is marked as active
  // Events are ordered alphabetically (case-insensitive) by name
  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userIdCol, isActive, visibility }, { eq, and }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true), eq(visibility, "public")),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  })

  // Cast the result to the PublicEvent[] type to indicate all are active
  return events as PublicEvent[]
}
