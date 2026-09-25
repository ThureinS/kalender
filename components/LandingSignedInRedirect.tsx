"use client"

import { useAuth } from "@clerk/nextjs"
import { useNavigationRouter } from "@/components/NavigationProgress"
import { useEffect } from "react"

export default function LandingSignedInRedirect() {
  const { isLoaded, userId } = useAuth()
  const router = useNavigationRouter()

  useEffect(() => {
    if (isLoaded && userId) {
      router.replace("/overview")
    }
  }, [isLoaded, router, userId])

  return null
}
