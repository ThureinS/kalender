'use client'

import type { PublicEvent } from "@/server/actions/events"
import type { UserProfile } from "@/server/actions/profiles"
import { CalendarX2, CheckCircle2, Clock3, Copy, Globe2, LinkIcon, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import PublicEventCard from "./PublicEventCard"
import {
  BookingContentColumn,
  BookingIdentityRail,
  BookingPageSplit,
} from "./layout/product-surfaces"
import { getProfileAccentStyle } from "@/lib/profileAccent"
import { appToast } from "@/lib/app-toast"

// Define types for the props that PublicProfile component will receive
type PublicProfileProps = {
    profile: UserProfile
    events: PublicEvent[]
    hasAvailability: boolean
    isOwner?: boolean
  }


  export default function PublicProfile({
    profile,
    events,
    hasAvailability,
    isOwner = false,
  }: PublicProfileProps) {

    const displayName = profile.displayName || "Kalender host"
    const initials = displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join("") || "K"


  const copyProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/book/${profile.handle}`)
      appToast.success("Booking Link copied.")
    } catch (error) {
      console.error("Failed to copy URL:", error)
      appToast.error("Booking Link was not copied.")
    }
  }

    return (
      <div style={getProfileAccentStyle(profile.accent)}>
        <BookingPageSplit className="min-h-[calc(100dvh-6rem)] py-8">
          <BookingIdentityRail className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-8 top-6 h-24 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-4 lg:block">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-display text-xl font-semibold text-primary-foreground shadow-[0_0_36px_-10px_var(--primary)] lg:size-20">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0 lg:mt-6">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Booking Page
                  </p>
                  <h1 className="mt-1 break-words font-display text-3xl font-semibold tracking-normal text-foreground lg:text-4xl">
                    {displayName}
                  </h1>
                </div>
              </div>

              <p className="mt-5 text-lg font-medium leading-7 text-foreground">
                {profile.headline || "Book a focused session without the scheduling back-and-forth."}
              </p>
              {profile.bio && (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {profile.bio}
                </p>
              )}

              <div className="mt-6 space-y-3 border-t border-border/80 pt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  {profile.location || "Online meetings"}
                </div>
                <div className="flex items-center gap-2">
                  <Globe2 className="size-4 text-primary" />
                  {profile.timezone}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  {events.length} active {events.length === 1 ? "event" : "events"}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/80 px-3 py-1.5 font-mono text-xs">
                  <span className={`size-2 rounded-full ${hasAvailability ? "bg-primary shadow-[0_0_8px_2px_var(--primary)]" : "bg-muted-foreground/45"}`} />
                  {hasAvailability ? "Open for scheduling" : "Availability not set"}
                </div>
              </div>

              {isOwner && (
                <Button
                    className="mt-6 w-full cursor-pointer"
                    variant="outline"
                    onClick={copyProfileUrl}
                >
                    <Copy className="size-4" />
                    Copy Booking Link
                </Button>
              )}
            </div>
          </BookingIdentityRail>

          <BookingContentColumn>
            <div className="rounded-lg border border-border/80 bg-card p-5 text-card-foreground shadow-[0_0_36px_-24px_var(--primary)] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Available Events
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-normal">
                    Choose a time to meet
                  </h2>
                </div>
                <div className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border border-border/80 px-3 py-1.5 text-xs text-muted-foreground">
                  <LinkIcon className="size-3.5 shrink-0" />
                  <span className="truncate">/book/{profile.handle}</span>
                </div>
              </div>
            </div>

            {!hasAvailability && events.length > 0 && (
              <div className="rounded-lg border border-border/80 bg-card p-6 text-card-foreground shadow-[0_0_36px_-24px_var(--primary)]">
                <div className="flex size-11 items-center justify-center rounded-full border border-border/80 bg-background text-primary">
                  <CalendarX2 className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold tracking-normal">
                  Booking is paused
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  {isOwner
                    ? "Set weekly availability before sharing this booking page."
                    : "This host has not opened booking times yet."}
                </p>
                {isOwner && (
                  <Button asChild className="mt-5">
                    <Link href="/schedule">Set availability</Link>
                  </Button>
                )}
              </div>
            )}

            {events.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/80 bg-card/60 p-8 text-center">
                <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-border/80 bg-background text-primary">
                  <Clock3 className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold tracking-normal text-foreground">
                  No bookable events yet
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  This booking page is live, but there are no public events available right now.
                </p>
                {isOwner && (
                  <Button asChild className="mt-5">
                    <Link href="/events/new">Create an event</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                    // Render a row for each public event
                    <PublicEventCard
                      key={event.id}
                      profileHandle={profile.handle}
                      event={event}
                      bookingDisabled={!hasAvailability}
                    />
                ))}
              </div>
            )}
          </BookingContentColumn>
        </BookingPageSplit>
      </div>
    )
    

  }
