"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      gap={8}
      visibleToasts={3}
      toastOptions={{
        duration: 3200,
        classNames: {
          toast:
            "group-[.toaster]:w-[min(360px,calc(100vw-2rem))] group-[.toaster]:gap-3 group-[.toaster]:rounded-lg group-[.toaster]:border-border group-[.toaster]:bg-popover group-[.toaster]:px-4 group-[.toaster]:py-3 group-[.toaster]:text-popover-foreground group-[.toaster]:shadow-lg",
          icon: "group-[.toaster]:text-primary",
          title: "group-[.toaster]:text-sm group-[.toaster]:font-semibold",
          description:
            "group-[.toaster]:text-xs group-[.toaster]:leading-5 group-[.toaster]:text-muted-foreground",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
