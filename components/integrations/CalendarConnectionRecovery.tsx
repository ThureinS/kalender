"use client"

import { useAuth, useUser } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Link from "@/components/NavigationLink"
import { rememberCalendarConnection, shouldRestoreCalendarConnection } from "@/server/actions/calendarConnection"
import { hasGoogleCalendarScopes, isGoogleConnection, requiredGoogleCalendarScopes } from "@/lib/setup-readiness"
import { calendarRestoreAttemptKey, claimCalendarRestoreAttempt, needsCalendarRestore } from "@/lib/calendar-restore"

export default function CalendarConnectionRecovery() {
  const { isLoaded, user } = useUser()
  const { sessionId } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const currentAttempt = useRef<string | null>(null)
  const inFlight = useRef<string | null>(null)
  const remembered = useRef<string | null>(null)
  const checkedServer = useRef<string | null>(null)
  const [notice, setNotice] = useState<{ key: string; kind: "restoring" | "attention" | "save-failed" } | null>(null)
  const account = user?.externalAccounts.find(isGoogleConnection)
  const key = sessionId && account ? calendarRestoreAttemptKey(sessionId, account.id) : null
  const isAuthRoute = pathname === "/" || ["/login", "/register", "/sso-callback"].some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  )

  useEffect(() => {
    currentAttempt.current = key
    const isCurrent = () => currentAttempt.current === key

    async function checkConnection() {
      if (!isLoaded || !user || !account || !key || isAuthRoute) return

      if (hasGoogleCalendarScopes(account)) {
        setNotice(null)
        if (user.publicMetadata.kalenderCalendarAccountId === account.id || remembered.current === key) return
        remembered.current = key
        try {
          if (await rememberCalendarConnection()) {
            if (isCurrent()) await user.reload()
          } else if (isCurrent()) {
            setNotice({ key, kind: "save-failed" })
          }
        } catch {
          if (isCurrent()) setNotice({ key, kind: "save-failed" })
        }
        return
      }

      if (!needsCalendarRestore(user.publicMetadata.kalenderCalendarAccountId, account)) {
        // The browser can retain metadata from before the host granted access.
        // Ask the server once per session/account before ruling out recovery.
        if (checkedServer.current === key) return
        checkedServer.current = key
        try {
          const shouldRestore = await shouldRestoreCalendarConnection()
          if (!isCurrent()) return
          if (!shouldRestore) return
        } catch {
          return
        }
      }
      if (inFlight.current === key) return
      let claimed = false
      try {
        claimed = claimCalendarRestoreAttempt(window.sessionStorage, key)
      } catch {
        // Accessing sessionStorage itself can throw when browser storage is blocked.
      }
      if (!claimed) {
        setNotice({ key, kind: "attention" })
        return
      }

      inFlight.current = key
      setNotice({ key, kind: "restoring" })
      try {
        // No forced consent: Google can reuse this host's existing grant.
        // Guests and replacement/disconnected accounts never enter this flow.
        const result = await account.reauthorize({
          additionalScopes: [...requiredGoogleCalendarScopes],
          redirectUrl: `${window.location.origin}/sso-callback?redirect_url=${encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)}`,
        })
        if (!isCurrent()) return
        const redirect = result.verification?.externalVerificationRedirectURL
        if (redirect) {
          window.location.assign(redirect.toString())
          return
        }
        const refreshed = await user.reload()
        if (!isCurrent()) return
        if (hasGoogleCalendarScopes(refreshed.externalAccounts.find(isGoogleConnection))) {
          setNotice(null)
          router.refresh()
        } else {
          setNotice({ key, kind: "attention" })
        }
      } catch {
        if (isCurrent()) setNotice({ key, kind: "attention" })
      }
    }

    void checkConnection()
    return () => { currentAttempt.current = null }
  }, [account, isAuthRoute, isLoaded, key, router, user])

  if (!notice || notice.key !== key || isAuthRoute) return null
  if (notice.kind !== "save-failed" && hasGoogleCalendarScopes(account)) return null

  return (
    <aside role="status" className="fixed bottom-4 left-4 right-4 z-50 rounded-lg border border-border bg-card p-4 text-sm text-card-foreground shadow-lg sm:left-auto sm:max-w-sm">
      <p>
        {notice.kind === "restoring"
          ? "Restoring your Calendar connection…"
          : notice.kind === "save-failed"
            ? "We couldn't save your Calendar connection preference. Refresh this page to try again."
            : "Your Calendar connection needs attention. Open Integrations to grant access again."}
      </p>
      {notice.kind === "attention" && (
        <Link href="/integrations" className="mt-2 inline-block font-medium text-primary underline underline-offset-4">Open Integrations</Link>
      )}
    </aside>
  )
}
