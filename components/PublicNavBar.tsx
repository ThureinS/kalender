"use client"

import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import Link from "@/components/NavigationLink"

import { Button } from "./ui/button"

const PublicNavBar = () => {
  const { isLoaded, userId } = useAuth()
  const pathname = usePathname()
  const bookingReturnUrl = pathname.startsWith("/book/") ? pathname : undefined
  const isSignedIn = isLoaded && Boolean(userId)

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-normal text-foreground"
        >
          Kalender
        </Link>

        <section className="flex justify-end">
          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <>
                <Button asChild variant="outline">
                  <Link href="/overview">Dashboard</Link>
                </Button>
                <UserButton />
              </>
            ) : (
              <>
                <SignInButton forceRedirectUrl={bookingReturnUrl} signUpForceRedirectUrl={bookingReturnUrl}>
                  <Button variant="ghost">Login</Button>
                </SignInButton>
                <SignUpButton forceRedirectUrl={bookingReturnUrl} signInForceRedirectUrl={bookingReturnUrl}>
                  <Button variant="outline">Register</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </section>
      </div>
    </nav>
  )
}

export default PublicNavBar
