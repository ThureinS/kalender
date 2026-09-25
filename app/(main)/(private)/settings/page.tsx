import { AppPageHeader } from "@/components/layout/product-surfaces"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getEvents } from "@/server/queries/events"
import { getOrCreateProfile } from "@/server/queries/profiles"
import { getSchedule } from "@/server/queries/schedule"
import { auth, currentUser } from "@clerk/nextjs/server"
import {
  CalendarClock,
  CalendarDays,
  LinkIcon,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import Link from "@/components/NavigationLink"
import type { ReactNode } from "react"

function SettingLink({
  icon,
  title,
  description,
  href,
}: {
  icon: ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-md border border-border/80 bg-background p-4 transition-colors hover:border-primary/45 hover:bg-accent/60"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border/80 bg-surface-subtle text-primary">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-muted-foreground">
          {description}
        </span>
      </span>
    </Link>
  )
}

export default async function SettingsPage() {
  const { userId, redirectToSignIn } = await auth()
  if (!userId) return redirectToSignIn()

  const user = await currentUser()
  const [profile, schedule, events] = await Promise.all([
    getOrCreateProfile({
      clerkUserId: userId,
      displayName: user?.fullName,
      avatarUrl: user?.imageUrl,
      email: user?.primaryEmailAddress?.emailAddress,
    }),
    getSchedule(userId),
    getEvents(userId),
  ])

  const primaryEmail = user?.primaryEmailAddress?.emailAddress
  const availabilityCount = schedule?.availabilities?.length ?? 0

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <AppPageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Review account-level details and jump to the editable preferences that shape your workspace."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Kalender keeps detailed edits in the product areas where they are used.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <SettingLink
              href="/booking-page"
              icon={<LinkIcon className="size-4" />}
              title="Booking Page"
              description="Edit your public identity, Link Name, timezone, location, and accent."
            />
            <SettingLink
              href="/schedule"
              icon={<CalendarClock className="size-4" />}
              title="Availability"
              description="Set the weekly hours people can choose from."
            />
            <SettingLink
              href="/events"
              icon={<CalendarDays className="size-4" />}
              title="Events"
              description="Create, edit, pause, and share event links."
            />
            <SettingLink
              href="/integrations"
              icon={<ShieldCheck className="size-4" />}
              title="Google Calendar"
              description="Review the account connection used for conflict checks and calendar events."
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Authentication and security are managed from the profile menu.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border/80 bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <UserRound className="size-4 text-primary" />
                  {user?.fullName || profile.displayName}
                </div>
                <div className="mt-2 flex items-center gap-2 break-all text-sm text-muted-foreground">
                  <Mail className="size-4 shrink-0" />
                  {primaryEmail ?? "No primary email available"}
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Use the avatar menu in the sidebar to manage sign-in methods,
                profile image, and account security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workspace Summary</CardTitle>
              <CardDescription>
                Current saved state for this Kalender workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3 rounded-md border border-border/80 bg-background px-3 py-2">
                <span className="text-muted-foreground">Public URL</span>
                <span className="break-all text-right font-mono">/book/{profile.handle}</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-md border border-border/80 bg-background px-3 py-2">
                <span className="text-muted-foreground">Events</span>
                <span className="font-medium">{events.length}</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-md border border-border/80 bg-background px-3 py-2">
                <span className="text-muted-foreground">Availability Blocks</span>
                <span className="font-medium">{availabilityCount}</span>
              </div>
            </CardContent>
          </Card>

          <Button asChild className="w-full" variant="outline">
            <Link href="/overview">Return to Overview</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
