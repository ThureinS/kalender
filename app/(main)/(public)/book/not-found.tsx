import {
  BookingContentColumn,
  BookingIdentityRail,
  BookingPageSplit,
} from "@/components/layout/product-surfaces"
import { Button } from "@/components/ui/button"
import { CalendarX2, Home, Search } from "lucide-react"
import Link from "next/link"

export default function BookingNotFound() {
  return (
    <BookingPageSplit className="min-h-[calc(100dvh-6rem)] py-8">
      <BookingIdentityRail className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-8 top-6 h-24 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_36px_-10px_var(--primary)]">
            <CalendarX2 className="size-7" />
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Link Not Found
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-normal text-foreground lg:text-4xl">
            This booking page is unavailable
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            The public link may have changed, the event may be private, or the host may have removed it.
          </p>
        </div>
      </BookingIdentityRail>

      <BookingContentColumn>
        <div className="rounded-lg border border-border/80 bg-card p-8 text-card-foreground shadow-[0_0_36px_-24px_var(--primary)]">
          <div className="flex size-12 items-center justify-center rounded-full border border-border/80 bg-background text-primary">
            <Search className="size-6" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-semibold tracking-normal">
            Check the booking link
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Ask the host for their current Booking Link, or head back to Kalender.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">
              <Home className="size-4" />
              Go home
            </Link>
          </Button>
        </div>
      </BookingContentColumn>
    </BookingPageSplit>
  )
}
