import { SignUp } from "@clerk/nextjs"

import AuthPageShell from "@/components/AuthPageShell"
import { kalenderClerkAppearance } from "@/lib/clerkAppearance"

const RegisterPage = () => {
  return (
    <AuthPageShell
      eyebrow="Create account"
      title="Create your scheduling workspace"
      description="Use Google or email to start setup, then finish your booking page inside onboarding."
    >
      <SignUp
        appearance={kalenderClerkAppearance}
        fallbackRedirectUrl="/onboarding"
        path="/register"
        routing="path"
        signInFallbackRedirectUrl="/overview"
        signInUrl="/login"
      />
    </AuthPageShell>
  )
}

export default RegisterPage
