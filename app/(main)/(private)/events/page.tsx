import EventCard from "@/components/cards/EventCard";
import { AppPageHeader } from "@/components/layout/product-surfaces";
import { Button } from "@/components/ui/button";
import { getEvents } from "@/server/queries/events";
import { getOrCreateProfile } from "@/server/queries/profiles";
import { auth, currentUser } from "@clerk/nextjs/server";
import { CalendarPlus, CalendarRange } from "lucide-react";
import Link from "@/components/NavigationLink";

export default async function EventsPage() {
    // Get the authenticated user's ID
    const { userId, redirectToSignIn } = await auth()
    // Redirect to sign-in page if user is not authenticated
    if (!userId) return redirectToSignIn()

    const events = await getEvents(userId)
    const user = await currentUser()
    const profile = await getOrCreateProfile({
        clerkUserId: userId,
        displayName: user?.fullName,
        avatarUrl: user?.imageUrl,
        email: user?.primaryEmailAddress?.emailAddress,
    })

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
            <AppPageHeader
                eyebrow="Workspace"
                title="Events"
                description="Create and manage the event links visitors can book."
                action={
                <Button
                    asChild
                >
                    <Link href="/events/new">
                        <CalendarPlus /> Create Event
                    </Link>
                </Button>
                }
            />


            {/* Show event cards if any exist, otherwise show empty state */}
            {events.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {events.map(event => (
                        <EventCard
                            key={event.id}
                            {...event}
                            profileHandle={profile.handle}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card p-8 text-center">
                    <CalendarRange className="size-10 text-muted-foreground" />
                    <div>
                        <h2 className="font-display text-xl font-semibold">No events yet</h2>
                        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                            Create your first event link so visitors can book time with you.
                        </p>
                    </div>
                    <Button
                        asChild>
                        <Link href="/events/new">
                            <CalendarPlus /> New Event
                        </Link>
                    </Button>
                </div>
            )}

        </section>
    )
}
