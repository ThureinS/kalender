
// This server-side file handles integration between a Clerk-authenticated user and their Google Calendar. It provides two main functions: one for fetching all the user's calendar events within a specified date range (`getCalendarEventTimes`), and another for creating a new calendar event (`createCalendarEvent`). It authenticates users via OAuth using Clerk, formats date values using `date-fns`, and communicates with the Google Calendar API using the `googleapis` package. The file ensures all logic runs securely on the server, marked explicitly by `'use server'`.
// Mark this file as server-side only
'use server'

import { clerkClient } from "@clerk/nextjs/server"
import { addMinutes } from "date-fns"
import { calendar_v3, google } from "googleapis"



async function getOAuthClient(clerkUserId: string) {
    try {
        // Initialize Clerk client
        const client = await clerkClient()

        // Fetch the OAuth access token for the given Clerk user ID
        const { data } = await client.users.getUserOauthAccessToken(clerkUserId, 'google')

        // Check if the data is empty or the token is missing, throw an error
        if (data.length === 0 || !data[0].token) {
            throw new Error("No OAuth data or token found for the user.")
        }


        // Initialize OAuth2 client with Google credentials
        const oAuthClient = new google.auth.OAuth2(
            process.env.GOOGLE_OAUTH_CLIENT_ID,
            process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            process.env.GOOGLE_OAUTH_REDIRECT_URL
        )

        // Set the credentials with the obtained access token
        oAuthClient.setCredentials({ access_token: data[0].token })

        return oAuthClient

    } catch(err: any) {
        // Catch any errors and rethrow with a detailed message
        throw new Error(`Failed to get OAuth client: ${err.message }`)
    }
}


// Fetch and format calendar events for a user between a given date range
export async function getCalendarEventTimes(
    clerkUserId: string,
    { start, end }: { start: Date; end: Date }
): Promise<{ start: Date; end: Date }[]> {

    try {
        // Get OAuth client for Google Calendar API authentication
        const oAuthClient = await getOAuthClient(clerkUserId)

        if (!oAuthClient) {
            throw new Error("OAuth client could not be obtained.")
        }


        const events = await google.calendar("v3").freebusy.query({
            auth: oAuthClient,
            requestBody: {
                timeMin: start.toISOString(),
                timeMax: end.toISOString(),
                items: [{ id: "primary" }],
            },
        })

        return (
            events.data.calendars?.primary?.busy
                ?.map(event => {
                    if (!event.start || !event.end) return undefined

                    return {
                        start: new Date(event.start),
                        end: new Date(event.end),
                    }
                })
                .filter((date): date is { start: Date; end: Date } => date !== undefined) || []
        )



    } catch (err: any) {
        if (process.env.NODE_ENV !== "production") {
            console.warn(
                `Skipping Google Calendar busy-time lookup in development: ${err.message || err}`
            )
            return []
        }

        throw new Error(`Failed to fetch calendar events: ${err.message || err}`)

    }

}

export async function createCalendarEvent({
                                              clerkUserId,
                                              guestName,
                                              guestEmail,
                                              startTime,
                                              guestNotes,
                                              durationInMinutes,
                                              eventName,
                                              eventLocation,
                                          }: {
    clerkUserId: string // The unique ID of the Clerk user.
    guestName: string // The name of the guest attending the event.
    guestEmail: string // The email address of the guest.
    startTime: Date // The start time of the event.
    guestNotes?: string | null // Optional notes for the guest (can be null or undefined).
    durationInMinutes: number // The duration of the event in minutes.
    eventName: string // The name or title of the event.
    eventLocation?: string | null // Where the meeting should happen.
}): Promise<calendar_v3.Schema$Event> {  // Specify the return type as `Event`, which represents the created calendar event.

    try {
        // Get OAuth client and user information for Google Calendar integration.
        const oAuthClient = await getOAuthClient(clerkUserId)
        if (!oAuthClient) {
            throw new Error("OAuth client could not be obtained.") // Error handling if OAuth client is not available.
        }

        const client = await clerkClient() // Retrieve the Clerk client instance.
        const calendarUser = await client.users.getUser(clerkUserId) // Get the user details from Clerk.

        // Get the user's primary email address from their profile.
        const primaryEmail = calendarUser.emailAddresses.find(
            ({ id }) => id === calendarUser.primaryEmailAddressId // Find the primary email using the ID.
        )

        if (!primaryEmail) {
            throw new Error("Clerk user has no email") // Throw an error if no primary email is found.
        }

        // Create the Google Calendar event using the Google API client.
        const calendarEvent = await google.calendar("v3").events.insert({
            calendarId: "primary", // Use the primary calendar of the user.
            auth: oAuthClient, // Authentication using the OAuth client obtained earlier.
            sendUpdates: "all", // Send email notifications to all attendees of the event.
            requestBody: {
                attendees: [
                    { email: guestEmail, displayName: guestName }, // Add the guest to the attendees list.
                    {
                        email: primaryEmail.emailAddress, // Add the user themselves as an attendee.
                        displayName: `${calendarUser.firstName} ${calendarUser.lastName}`, // Display name for the user.
                        responseStatus: "accepted", // Mark the user's attendance as accepted.
                    },
                ],
                description: guestNotes ? `Additional Details: ${guestNotes}` : "No additional details.", // Add description if guest notes are provided.
                start: {
                    dateTime: startTime.toISOString(), // Start time of the event.
                },
                end: {
                    dateTime: addMinutes(startTime, durationInMinutes).toISOString(), // Calculate the end time based on the duration.
                },
                summary: `${guestName} + ${calendarUser.firstName} ${calendarUser.lastName}: ${eventName}`, // Title of the event, including the guest and user names.
                location: eventLocation || undefined,
            },
        })

        return calendarEvent.data  // Return the event data that includes the details of the newly created calendar event.
    } catch (error: any) {
        // Catch and handle any errors that occur during the process.
        console.error("Error creating calendar event:", error.message || error) // Log the error to the console.
        throw new Error(`Failed to create calendar event: ${error.message || error}`) // Throw a new error with a detailed message.
    }
}
