import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"

export default function SsoCallbackPage() {
  return (
    <AuthenticateWithRedirectCallback
      signInUrl="/login"
      signUpUrl="/register"
      signInFallbackRedirectUrl="/onboarding#calendar"
      signUpFallbackRedirectUrl="/onboarding#calendar"
    />
  )
}
