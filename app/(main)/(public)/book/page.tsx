import { getOrCreateProfile } from "@/server/actions/profiles"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function PublicPage() {
    const user = await currentUser()
    if (!user) {
        // Redirect to login if no user is found
        return redirect('/login')
    }

    const profile = await getOrCreateProfile({
        clerkUserId: user.id,
        displayName: user.fullName,
        avatarUrl: user.imageUrl,
        email: user.primaryEmailAddress?.emailAddress,
    })

    // Once user is available, redirect to the booking page [Public Profile Page]
    return redirect(`/book/${profile.handle}`)
}
