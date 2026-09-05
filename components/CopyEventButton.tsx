"use client"
 // Marks this file for client-side rendering (required for hooks like useState)

import { VariantProps } from "class-variance-authority"
// VariantProps is a TypeScript utility type from the class-variance-authority (CVA) library. It’s used to type the props for variants (like size, color, style, etc.)
import { Button, buttonVariants } from "./ui/button"
import { cn } from "@/lib/utils"
import { CopyIcon } from "lucide-react"
import { useState } from "react"
import { appToast } from "@/lib/app-toast"


// Define the possible visual states for the copy action
type CopyState = "idle" | "copied" | "error"

// Define the props for the CopyEventButton component
interface CopyEventButtonProps
  extends Omit<React.ComponentProps<"button">, "children" | "onClick">, // Inherit all native button props except children & onClick
    VariantProps<typeof buttonVariants> { // Allow variant and size props from button styling
  bookingPath: string // Public booking path to copy
}

// Returns the appropriate button label based on the current copy state
function getCopyLabel(state: CopyState) {
    switch (state) {
    case "copied":
        return "Copied!"
    case "error":
        return "Error"
    case "idle":
    default:
        return "Copy Link"
    }
}
  


// Reusable button component that copies a URL to clipboard
export function CopyEventButton({
    bookingPath,
    className,
    variant,
    size,
    ...props // Any other button props like disabled, type, etc.
  } : CopyEventButtonProps) {

  
    const [copyState, setCopyState] = useState<CopyState>("idle") // Manage the copy feedback state

    const handleCopy = () => {
        const url = `${location.origin}${bookingPath}` // Construct the booking URL
    
        navigator.clipboard
          .writeText(url) // Try to copy the URL
          .then(() => {
            setCopyState("copied") // On success, show "Copied!" state
            appToast.success("Link copied.")
            setTimeout(() => setCopyState("idle"), 2000) // Reset after 2 seconds
          })
          .catch(() => {
            setCopyState("error") // On failure, show "Error" state
            appToast.error("Link was not copied.")
            setTimeout(() => setCopyState("idle"), 2000) // Reset after 2 seconds
          })
      }
    

    return (
        <Button
          onClick={handleCopy}
          className={cn(buttonVariants({ variant, size }), 'cursor-pointer', className)} // Apply variant/size classes + any custom classes
          variant={variant}
          size={size}
          {...props}
        >
          <CopyIcon className="size-4 mr-2" /> {/* Icon that changes with copy state */}
          {getCopyLabel(copyState)} {/* Text label that changes with copy state */}
        </Button>
      )
}
