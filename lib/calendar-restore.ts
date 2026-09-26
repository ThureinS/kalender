import { hasGoogleCalendarScopes } from "@/lib/setup-readiness"

type CalendarAccount = { id: string; approvedScopes?: string | null }

export function needsCalendarRestore(
  rememberedAccountId: unknown,
  account: CalendarAccount | undefined,
) {
  return Boolean(account && rememberedAccountId === account.id && !hasGoogleCalendarScopes(account))
}

export function calendarRestoreAttemptKey(sessionId: string, accountId: string) {
  return `kalender-calendar-restore:${sessionId}:${accountId}`
}

// Claim before redirecting so denial, errors or missing scopes cannot loop.
// If storage is blocked, leave recovery to the explicit Integrations button.
export function claimCalendarRestoreAttempt(
  storage: Pick<Storage, "getItem" | "setItem">,
  key: string,
) {
  try {
    if (storage.getItem(key)) return false
    storage.setItem(key, "attempted")
    return true
  } catch {
    return false
  }
}
