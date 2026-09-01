import { formatEventDescription } from "@/lib/formatters"
import type { PublicEvent } from "@/server/actions/events"
import Link from "next/link"
import { ArrowRight, Clock, MapPin } from "lucide-react"

// Type definition for event card props
type PublicEventCardProps = {
    profileHandle: string
    event: PublicEvent
    bookingDisabled?: boolean
  }

// Component to display a single event card
export default  function PublicEventCard({
    profileHandle,
    event,
    bookingDisabled = false,
    }: PublicEventCardProps) {
        const className = bookingDisabled
          ? "grid gap-4 rounded-lg border border-border/80 bg-card/60 p-5 text-card-foreground opacity-75 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
          : "group grid gap-4 rounded-lg border border-border/80 bg-card p-5 text-card-foreground shadow-[0_0_0_1px_transparent] transition-colors hover:border-primary/70 hover:bg-surface-raised hover:shadow-[0_0_28px_-16px_var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"

        const content = (
          <>
            <div className="min-w-0">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                <h3 className="break-words font-display text-xl font-semibold tracking-normal">
                  {event.name}
                </h3>
              </div>
              {event.description && (
                <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {event.description}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 px-2.5 py-1 font-mono">
                  <Clock className="size-3.5 text-primary" />
                  {formatEventDescription(event.durationInMinutes)}
                </span>
                <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-border/80 px-2.5 py-1">
                  <MapPin className="size-3.5 shrink-0 text-primary" />
                  <span className="truncate">{event.location}</span>
                </span>
              </div>
            </div>
            <div className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md border border-border/80 bg-background px-3 text-sm font-medium text-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
              {bookingDisabled ? "Availability needed" : "Book"}
              {!bookingDisabled && (
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              )}
              <span className="sr-only">
                {bookingDisabled ? `${event.name} is not available to book` : `Select ${event.name}`}
              </span>
            </div>
          </>
        )

        if (bookingDisabled) {
          return (
            <div className={className} aria-disabled="true">
              {content}
            </div>
          )
        }

        return (
            <Link
              href={`/book/${profileHandle}/${event.slug ?? event.id}`}
              className={className}
            >
              {content}
            </Link>
          )
    }
