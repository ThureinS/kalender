import Link from "@/components/NavigationLink"
import { Button } from "@/components/ui/button"
import type { getDemoVisitorAccess } from "@/server/demoVisitorAccess"
import DemoVisitorButtons from "@/components/DemoVisitorButtons"

export default function DemoVisitorAccess({
  access,
}: {
  access: NonNullable<ReturnType<typeof getDemoVisitorAccess>>
}) {
  if (access.kind === "ticket") return (
    <section id="demo-access" aria-labelledby="demo-access-title" className="scroll-mt-8 rounded-lg border border-primary/30 bg-card p-5 sm:p-8">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">Demo visitor access</p>
      <h2 id="demo-access-title" className="mt-3 font-display text-3xl font-semibold">Try booking as a guest</h2>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        Choose a shared visitor account below. No registration, password, email
        verification or Google Calendar connection is needed.
      </p>
      <div className="mt-6">
        <DemoVisitorButtons count={access.visitorCount} bookingPath={access.bookingPath} />
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        You&apos;ll open Portfolio Review. These accounts are shared with other
        visitors; keep personal information out of their workspace profiles.
      </p>
      <p className="mt-6 rounded-md border border-primary/30 bg-primary/10 p-4 text-sm leading-6">
        {access.bookingsEnabled
          ? "Exploring the form does not create a booking. Submitting it creates a real test Calendar event and asks Google to send an invitation. No meeting takes place; enter your own email in the booking form."
          : "Booking confirmation is currently paused. You can browse the demo and explore its workspace without sending a Calendar invitation."}
      </p>
    </section>
  )
  return (
    <section id="demo-access" aria-labelledby="demo-access-title" className="scroll-mt-8 rounded-lg border border-primary/30 bg-card p-5 sm:p-8">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">Demo visitor access</p>
      <h2 id="demo-access-title" className="mt-3 font-display text-3xl font-semibold">Try booking as a guest</h2>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        Browse freely, then use a shared visitor login to explore the booking form.
        You don&apos;t need to create an account, set up a workspace, or connect Google Calendar.
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border bg-background p-4 sm:p-5">
          <h3 className="font-semibold">Choose any visitor email</h3>
          <ul className="mt-3 space-y-3 text-xs leading-5 sm:text-sm">
            {access.emails.map(email => (
              <li key={email}><code className="select-all break-all text-foreground">{email}</code></li>
            ))}
          </ul>
          <dl className="mt-5 space-y-4 border-t border-border pt-4">
            <div>
              <dt className="text-sm text-muted-foreground">Shared demo password</dt>
              <dd className="mt-1"><code className="select-all break-all text-xs leading-5 text-foreground sm:text-base">{access.password}</code></dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Email verification code, if prompted</dt>
              <dd className="mt-1"><code className="select-all text-lg tracking-widest text-foreground">{access.verificationCode}</code></dd>
            </div>
          </dl>
        </div>
        <div className="min-w-0">
          <ol className="list-decimal space-y-3 pl-5 leading-7 text-muted-foreground">
            <li>Open Portfolio Review using the button below.</li>
            <li>Select <strong className="text-foreground">Login</strong> at the top of that page.</li>
            <li>Enter one visitor email and the shared password. If asked to check your email, enter the verification code shown here; no inbox is needed.</li>
            <li>You&apos;ll return to Portfolio Review. Choose your timezone, a date and an available time to explore the form.</li>
          </ol>
          <Button asChild className="mt-5">
            <Link href={access.bookingPath}>Open Portfolio Review</Link>
          </Button>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            These are shared demo accounts. Use them only for this demo and keep personal information out of their profiles.
          </p>
        </div>
      </div>
      <p className="mt-6 rounded-md border border-primary/30 bg-primary/10 p-4 text-sm leading-6">
        Exploring the form does not create a booking. Submitting it creates a real calendar event and sends an invitation to the email you enter, but no meeting will take place.
        If you choose to book, use your own email in the booking form; the shared login emails have no inbox.
      </p>
    </section>
  )
}
