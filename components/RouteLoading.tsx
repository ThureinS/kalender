import { NavigationPending } from "./NavigationProgress"

export default function RouteLoading() {
  return (
    <div className="mx-auto min-h-[50vh] w-full max-w-6xl space-y-8 px-6 py-10 sm:px-8" aria-busy="true">
      <NavigationPending />
      <div className="space-y-3 motion-safe:animate-pulse" aria-hidden="true">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-8 w-52 rounded bg-muted" />
        <div className="h-4 w-full max-w-lg rounded bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2" aria-hidden="true">
        {[0, 1].map(index => (
          <div key={index} className="space-y-4 rounded-lg border border-border bg-card p-6 motion-safe:animate-pulse">
            <div className="h-10 w-10 rounded-lg bg-muted" />
            <div className="h-5 w-2/3 rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-3/4 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
