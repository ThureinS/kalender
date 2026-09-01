"use client"

import {
  BookingContentColumn,
  BookingIdentityRail,
  BookingPageSplit,
} from "@/components/layout/product-surfaces"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function BookingError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <BookingPageSplit className="min-h-[calc(100dvh-6rem)] py-8">
      <BookingIdentityRail className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-8 top-6 h-24 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertTriangle className="size-7" />
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Booking Unavailable
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-normal text-foreground lg:text-4xl">
            We could not load this booking page
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            The link may be temporarily unavailable, or the calendar connection may need a moment.
          </p>
        </div>
      </BookingIdentityRail>

      <BookingContentColumn>
        <div className="rounded-lg border border-border/80 bg-card p-8 text-card-foreground shadow-[0_0_36px_-24px_var(--primary)]">
          <h2 className="font-display text-2xl font-semibold tracking-normal">
            Try loading it again
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            If the problem continues, the host may need to reconnect their calendar or update this event.
          </p>
          <Button className="mt-6" onClick={reset}>
            <RefreshCw className="size-4" />
            Retry
          </Button>
        </div>
      </BookingContentColumn>
    </BookingPageSplit>
  )
}
