"use client"

import { Button } from "@/components/ui/button"

export default function WorkspaceError({ reset }: { reset: () => void; error: Error & { digest?: string } }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold">This workspace is temporarily unavailable</h1>
      <p className="mt-3 text-muted-foreground">We could not load your workspace. Try again in a moment.</p>
      <Button className="mt-6" onClick={reset}>Try again</Button>
    </div>
  )
}
