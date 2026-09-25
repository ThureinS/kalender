"use client"

import { usePathname } from "next/navigation"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { PrivateNavLinks } from "@/constants"

export default function AppThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isWorkspace = [...PrivateNavLinks.map(item => item.route), "/onboarding"].some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  )

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="kalender-workspace-theme"
      forcedTheme={isWorkspace ? undefined : "dark"}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
