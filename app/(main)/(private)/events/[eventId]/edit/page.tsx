import EventForm from "@/components/forms/EventForm"
import { AppPageHeader } from "@/components/layout/product-surfaces"
import { Button } from "@/components/ui/button"
import { getEvent } from "@/server/queries/events"
import { getOrCreateProfile } from "@/server/queries/profiles"
import { auth, currentUser } from "@clerk/nextjs/server"
import { AlertTriangle } from "lucide-react"
import Link from "@/components/NavigationLink"

// The default exported async function for the EditEventPage
export default async function EditEventPage({
                                                params,// Extracting the eventId from the URL params
                                            }: {
    params: Promise<{ eventId: string }>
}) {
    // Get the current authenticated user and handle the redirect if the user is not logged in
    const { userId, redirectToSignIn } = await auth()
    if (!userId) return redirectToSignIn() // If no userId, redirect to sign-in

    const { eventId } = await params
    // Fetch the event from the database using the eventId and the logged-in user's ID
    const event = await getEvent(userId, eventId)
    if(!event) {
        return (
            <section className="mx-auto flex min-h-[420px] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 py-8 text-center sm:px-6 lg:px-8">
                <div className="flex size-12 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
                    <AlertTriangle className="size-5" />
                </div>
                <div>
                    <h1 className="font-display text-2xl font-semibold tracking-normal">Event not found</h1>
                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        It may have been deleted, or you may not have access to edit it.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/events">Back to Events</Link>
                </Button>
            </section>
        )
    }

    const user = await currentUser()
    const profile = await getOrCreateProfile({
        clerkUserId: userId,
        displayName: user?.fullName,
        avatarUrl: user?.imageUrl,
        email: user?.primaryEmailAddress?.emailAddress,
    })

    // Render the page with a card layout, displaying the "Edit Event" form
    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
            <AppPageHeader
                eyebrow="Events"
                title="Edit Event"
                description="Update the event details visitors see before booking."
            />
            <EventForm
                profileHandle={profile.handle}
                event={{ ...event, description: event.description || undefined }}
            />
        </section>
    )


}
