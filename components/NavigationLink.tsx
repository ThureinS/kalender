"use client"

import NextLink, { useLinkStatus } from "next/link"
import type { ComponentProps } from "react"
import { NavigationPending } from "./NavigationProgress"

function LinkPending() {
  const { pending } = useLinkStatus()
  return <NavigationPending pending={pending} />
}

// Let Next.js handle modified clicks, new tabs, external links and same-page
// anchors. Only an actual pending client navigation starts the progress bar.
export default function NavigationLink({ children, ...props }: ComponentProps<typeof NextLink>) {
  return (
    <NextLink {...props}>
      {children}
      <LinkPending />
    </NextLink>
  )
}
