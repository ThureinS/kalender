// This code defines a React component called `NewEventPage`, which renders a page for creating a new event. It uses a card layout to display a centered form on the screen. The card includes a header with the title "New Event" and a content section that contains the `EventForm` component, which likely handles the user input and submission logic for creating a new calendar event. The layout is styled using utility classes to make it visually appealing and responsive, ensuring a clean and focused user interface for event creation.

import EventForm from "@/components/forms/EventForm";
import { AppPageHeader } from "@/components/layout/product-surfaces";
import { getOrCreateProfile } from "@/server/actions/profiles";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function NewEventPage(){
    const { userId, redirectToSignIn } = await auth()
    if (!userId) return redirectToSignIn()

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
                eyebrow="Events"
                title="New Event"
                description="Create an event link visitors can book from your Booking Page."
            />
            <EventForm profileHandle={profile.handle} />
        </section>
    )
}
