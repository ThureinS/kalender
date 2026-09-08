import { SignIn } from "@clerk/nextjs"

import AuthPageShell from "@/components/AuthPageShell"
import { kalenderClerkAppearance } from "@/lib/clerkAppearance"

const LoginPage = () => {
  return (
    <AuthPageShell
      eyebrow="Welcome back"
      title="Open your Kalender workspace"
      description="Sign in to manage event links, availability, Google Calendar, and booking history."
    >
      <SignIn
        appearance={kalenderClerkAppearance}
        fallbackRedirectUrl="/overview"
        path="/login"
        routing="path"
        signUpFallbackRedirectUrl="/register"
        signUpUrl="/register"
      />
    </AuthPageShell>
  )
}

export default LoginPage
