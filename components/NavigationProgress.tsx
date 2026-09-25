"use client"

import { useRouter } from "next/navigation"
import {
  createContext, useCallback, useContext, useEffect, useId, useMemo,
  useState, useTransition, type ReactNode,
} from "react"

type NavigationContextValue = {
  registerPending: (id: string) => () => void
  router: ReturnType<typeof useRouter>
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

function useNavigationContext() {
  const value = useContext(NavigationContext)
  if (!value) throw new Error("Navigation feedback requires NavigationProgressProvider")
  return value
}

export function NavigationProgressProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [pendingSources, setPendingSources] = useState<Set<string>>(() => new Set())

  // Links and streamed loading boundaries can overlap. One completing should
  // not hide the indicator while another is still waiting.
  const registerPending = useCallback((id: string) => {
    setPendingSources(current => new Set(current).add(id))
    return () => setPendingSources(current => {
      const next = new Set(current)
      next.delete(id)
      return next
    })
  }, [])

  const trackedRouter = useMemo<ReturnType<typeof useRouter>>(() => ({
    ...router,
    push: (href, options) => startTransition(() => router.push(href, options)),
    replace: (href, options) => startTransition(() => router.replace(href, options)),
    refresh: () => startTransition(() => router.refresh()),
  }), [router])
  const value = useMemo(() => ({ registerPending, router: trackedRouter }), [registerPending, trackedRouter])
  const active = isPending || pendingSources.size > 0

  return (
    <NavigationContext.Provider value={value}>
      <div role="status" aria-live="polite" aria-atomic="true" className="pointer-events-none">
        {active && (
          <div className="kalender-navigation-progress" aria-hidden="true">
            <div className="kalender-navigation-progress-bar" />
          </div>
        )}
        <span className="sr-only">{active ? "Loading page…" : ""}</span>
      </div>
      {children}
    </NavigationContext.Provider>
  )
}

export function NavigationPending({ pending = true }: { pending?: boolean }) {
  const { registerPending } = useNavigationContext()
  const id = useId()
  useEffect(() => {
    if (pending) return registerPending(id)
  }, [id, pending, registerPending])
  return null
}

export function useNavigationRouter() {
  return useNavigationContext().router
}
