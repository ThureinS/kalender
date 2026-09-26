"use client"

import { useState } from "react"
import { CalendarCheck2, Loader2, Settings } from "lucide-react"
import { useClerk, useUser } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import { appToast } from "@/lib/app-toast"
import {
  isGoogleConnection,
  requiredGoogleCalendarScopes,
} from "@/lib/setup-readiness"

type GoogleCalendarConnectButtonProps = {
  connected: boolean
  hasCalendarScopes?: boolean
  sharedDemoVisitor?: boolean
}

function hasGoogleCalendarScope(approvedScopes: string) {
  const scopes = approvedScopes.split(" ")

  return requiredGoogleCalendarScopes.every(scope => scopes.includes(scope))
}

export function GoogleCalendarConnectButton({
  connected,
  hasCalendarScopes = false,
  sharedDemoVisitor = false,
}: GoogleCalendarConnectButtonProps) {
  const { user } = useUser()
  const clerk = useClerk()
  const [isConnecting, setIsConnecting] = useState(false)

  async function connectGoogle() {
    if (sharedDemoVisitor) return
    if (!user) {
      appToast.error("Sign in before connecting Google Calendar.")
      return
    }

    const redirectUrl = `${window.location.origin}/sso-callback?redirect_url=${encodeURIComponent("/onboarding#calendar")}`
    const googleAccount = user.externalAccounts.find(
      account => isGoogleConnection(account)
    )

    setIsConnecting(true)
    const toastId = appToast.loading(
      googleAccount && !hasGoogleCalendarScope(googleAccount.approvedScopes)
        ? "Requesting calendar access..."
        : "Opening Google connection..."
    )

    try {
      const externalAccount = googleAccount
        ? await googleAccount.reauthorize({
            redirectUrl,
            additionalScopes: [...requiredGoogleCalendarScopes],
            oidcPrompt: "consent",
          })
        : await user.createExternalAccount({
            strategy: "oauth_google",
            redirectUrl,
            additionalScopes: [...requiredGoogleCalendarScopes],
            oidcPrompt: "consent",
          })

      const verificationUrl =
        externalAccount.verification?.externalVerificationRedirectURL

      if (verificationUrl) {
        window.location.href = verificationUrl.toString()
        return
      }

      await user.reload()
      appToast.success("Google Calendar connected.")
    } catch (error) {
      console.error("Failed to connect Google Calendar:", error)
      appToast.error("Google Calendar connection failed.", {
        description: "Open account settings or try the connection again.",
      })
    } finally {
      appToast.dismiss(toastId)
      setIsConnecting(false)
    }
  }

  if (sharedDemoVisitor) return (
    <p className="rounded-md border border-border bg-surface-subtle p-4 text-sm leading-6 text-muted-foreground">
      This is a shared demo visitor account. Keep your personal Google account
      separate; the demo host&apos;s Calendar handles guest bookings.
    </p>
  )

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button type="button" onClick={connectGoogle} disabled={isConnecting}>
        {isConnecting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <CalendarCheck2 className="size-4" />
        )}
        {connected
          ? hasCalendarScopes
            ? "Reconnect Google"
            : "Grant Calendar Access"
          : "Connect Google"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => clerk.openUserProfile()}
      >
        <Settings className="size-4" />
        Account Settings
      </Button>
    </div>
  )
}
