import PublicProfile from "@/components/PublicProfile"
import { getPublicEvents } from "@/server/queries/events"
import { getSchedule } from "@/server/queries/schedule"
import { resolvePublicProfileSegment } from "@/server/publicBooking"
import { notFound, redirect } from "next/navigation"


export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const { profile, isLegacySegment } = await resolvePublicProfileSegment(handle)

  if (!profile) notFound()
  if (isLegacySegment) redirect(`/book/${profile.handle}`)

  const [events, schedule] = await Promise.all([
    getPublicEvents(profile.clerkUserId),
    getSchedule(profile.clerkUserId),
  ])
  const hasAvailability = (schedule?.availabilities.length ?? 0) > 0

  // Render PublicProfile component
  return (
    <PublicProfile
      profile={profile}
      events={events}
      hasAvailability={hasAvailability}
    />
  )
}
