import {
  BookingContentColumn,
  BookingIdentityRail,
  BookingPageSplit,
} from "@/components/layout/product-surfaces"

function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-3 animate-pulse rounded-full bg-muted ${className}`}
      aria-hidden="true"
    />
  )
}

export default function BookingLoading() {
  return (
    <BookingPageSplit className="min-h-[calc(100dvh-6rem)] py-8">
      <BookingIdentityRail className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-8 top-6 h-24 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <div className="size-16 animate-pulse rounded-full bg-primary/40 shadow-[0_0_36px_-10px_var(--primary)]" />
          <SkeletonLine className="mt-6 w-24" />
          <SkeletonLine className="mt-4 h-8 w-48" />
          <SkeletonLine className="mt-5 w-full" />
          <SkeletonLine className="mt-3 w-4/5" />
          <div className="mt-6 space-y-3 border-t border-border/80 pt-6">
            <SkeletonLine className="w-36" />
            <SkeletonLine className="w-32" />
            <SkeletonLine className="w-40" />
          </div>
        </div>
      </BookingIdentityRail>

      <BookingContentColumn>
        <div className="rounded-lg border border-border/80 bg-card p-5 shadow-[0_0_36px_-24px_var(--primary)] sm:p-6">
          <SkeletonLine className="w-28" />
          <SkeletonLine className="mt-4 h-7 w-56" />
        </div>
        <div className="rounded-lg border border-border/80 bg-card p-5">
          <SkeletonLine className="h-5 w-40" />
          <SkeletonLine className="mt-3 w-full" />
          <SkeletonLine className="mt-2 w-2/3" />
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <SkeletonLine className="h-10" />
            <SkeletonLine className="h-10" />
            <SkeletonLine className="h-10" />
          </div>
        </div>
      </BookingContentColumn>
    </BookingPageSplit>
  )
}
