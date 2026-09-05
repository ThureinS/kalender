import { AppPageHeader } from "@/components/layout/product-surfaces"
import { GoogleCalendarConnectButton } from "@/components/integrations/GoogleCalendarConnectButton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { auth, currentUser } from "@clerk/nextjs/server"
import {
  CalendarCheck2,
  CheckCircle2,
  CircleAlert,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"
import { hasGoogleCalendarScopes } from "@/lib/setup-readiness"

export default async function IntegrationsPage() {
  const { userId, redirectToSignIn } = await auth()
  if (!userId) return redirectToSignIn()

  const user = await currentUser()
  const googleAccount = user?.externalAccounts.find(
    account => account.provider === "google"
  )
  const approvedScopes = googleAccount?.approvedScopes.split(" ").filter(Boolean)
  const hasCalendarScopes = hasGoogleCalendarScopes(googleAccount)

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <AppPageHeader
        eyebrow="Workspace"
        title="Integrations"
        description="Manage the calendar connection Kalender uses for availability checks and confirmed meetings."
      />

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck2 className="size-5 text-primary" />
              Google Calendar
            </CardTitle>
            <CardDescription className="mt-2">
              Kalender checks busy times and creates confirmed meeting events on your primary calendar.
            </CardDescription>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-surface-subtle px-3 py-1.5 text-xs font-medium">
            {hasCalendarScopes ? (
              <>
                <CheckCircle2 className="size-3.5 text-primary" />
                Connected
              </>
            ) : googleAccount ? (
              <>
                <CircleAlert className="size-3.5 text-muted-foreground" />
                Needs access
              </>
            ) : (
              <>
                <CircleAlert className="size-3.5 text-muted-foreground" />
                Not connected
              </>
            )}
          </span>
        </CardHeader>
        <CardContent className="space-y-5">
          <GoogleCalendarConnectButton
            connected={Boolean(googleAccount)}
            hasCalendarScopes={hasCalendarScopes}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border/80 bg-background p-4">
              <Mail className="size-5 text-primary" />
              <p className="mt-3 text-sm font-medium">Account</p>
              <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">
                {googleAccount?.emailAddress ?? "No Google account connected"}
              </p>
            </div>
            <div className="rounded-lg border border-border/80 bg-background p-4">
              <ShieldCheck className="size-5 text-primary" />
              <p className="mt-3 text-sm font-medium">Access</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {googleAccount
                  ? hasCalendarScopes
                    ? "Calendar scopes are available through Clerk."
                    : "Google is connected, but Kalender still needs Calendar access."
                  : "Connect Google to enable calendar access."}
              </p>
            </div>
            <div className="rounded-lg border border-border/80 bg-background p-4">
              <RefreshCw className="size-5 text-primary" />
              <p className="mt-3 text-sm font-medium">Sync Behavior</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Busy times are checked when visitors pick slots; events are created after confirmation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connection Details</CardTitle>
          <CardDescription>
            Current state from Clerk for the signed-in account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {googleAccount ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border/80 bg-background p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Provider
                  </p>
                  <p className="mt-2 text-sm font-medium">Google</p>
                </div>
                <div className="rounded-lg border border-border/80 bg-background p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Identifier
                  </p>
                  <p className="mt-2 break-all text-sm font-medium">
                    {googleAccount.emailAddress}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-border/80 bg-background p-4">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Approved Scopes
                </p>
                {approvedScopes && approvedScopes.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {approvedScopes.map(scope => (
                      <span
                        key={scope}
                        className="max-w-full break-all rounded-md border border-border bg-surface-subtle px-2 py-1 font-mono text-xs text-muted-foreground"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Clerk did not return scope details for this connection.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-background p-6 text-sm leading-6 text-muted-foreground">
              Google Calendar is the only integration Kalender uses right now.
              Once connected, this page will show the account and OAuth access
              Clerk returns for the signed-in user.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
