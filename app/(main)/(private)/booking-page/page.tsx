import BookingPageForm from "@/components/forms/BookingPageForm"
import { AppPageHeader } from "@/components/layout/product-surfaces"
import { Button } from "@/components/ui/button"
import { isProfileAccent } from "@/lib/profileAccent"
import { getOrCreateProfile } from "@/server/queries/profiles"
import { auth, currentUser } from "@clerk/nextjs/server"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export default async function BookingPageSettingsPage() {
  const { userId, redirectToSignIn } = await auth()
  if (!userId) return redirectToSignIn()

  const user = await currentUser()
  const profile = await getOrCreateProfile({
    clerkUserId: userId,
    displayName: user?.fullName,
    avatarUrl: user?.imageUrl,
    email: user?.primaryEmailAddress?.emailAddress,
  })

  const accent = isProfileAccent(profile.accent) ? profile.accent : "lime"

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <AppPageHeader
        eyebrow="Workspace"
        title="Booking Page"
        description="Manage the identity, Booking Link, and public profile visitors see before they choose an event."
        action={
          <Button asChild variant="outline">
            <Link href={`/book/${profile.handle}`} target="_blank">
              <ExternalLink className="size-4" />
              Open Public URL
            </Link>
          </Button>
        }
      />

      <BookingPageForm
        profile={{
          displayName: profile.displayName,
          handle: profile.handle,
          headline: profile.headline ?? "",
          bio: profile.bio ?? "",
          timezone: profile.timezone,
          location: profile.location ?? "",
          accent,
          avatarUrl: profile.avatarUrl,
        }}
      />
    </section>
  )
}
