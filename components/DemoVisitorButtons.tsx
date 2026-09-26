"use client"

import { useAuth, useSignIn } from "@clerk/nextjs"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NavigationPending, useNavigationRouter } from "@/components/NavigationProgress"
import { createDemoVisitorSignIn } from "@/server/actions/demoVisitorSignIn"

export default function DemoVisitorButtons({ count, bookingPath }: { count: number; bookingPath: string }) {
  const { isLoaded, userId } = useAuth()
  const { signIn } = useSignIn()
  const router = useNavigationRouter()
  const [pending, setPending] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function enterDemo(index: number) {
    setError(null)
    if (userId) { router.push(bookingPath); return }
    setPending(index)
    try {
      const result = await createDemoVisitorSignIn(index)
      if ("error" in result) throw new Error(result.error)
      if ("alreadySignedIn" in result) { router.push(result.bookingPath); return }
      const started = await signIn.ticket({ ticket: result.ticket })
      if (started.error || signIn.status !== "complete") throw new Error("Could not complete demo sign-in.")
      const finished = await signIn.finalize({ navigate: ({ decorateUrl }) => {
        window.location.assign(decorateUrl(result.bookingPath))
      } })
      if (finished.error) throw new Error("Could not open the demo account.")
    } catch {
      setError("We could not open the demo account. Please try again shortly.")
    } finally { setPending(null) }
  }

  return (
    <div className="space-y-3">
      <NavigationPending pending={pending !== null} />
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <Button key={index} disabled={!isLoaded || pending !== null} onClick={() => enterDemo(index)}>
            {pending === index ? "Opening demo…" : `Demo Visitor ${index + 1}`}
          </Button>
        ))}
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
