import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { formatEventDescription } from "@/lib/formatters"
import { Button } from "../ui/button"
import Link from "next/link"
import { CopyEventButton } from "../CopyEventButton"
import { CalendarClock, Clock3, Eye, EyeOff, MapPin } from "lucide-react"

  // Type definition for event card props
type EventCardProps = {
    id: string
    isActive: boolean
    name: string
    slug: string | null
    description: string | null
    durationInMinutes: number
    location: string
    visibility: "public" | "private"
    bufferMinutes: number
    profileHandle: string
  }
  
  // Component to display a single event card
  export default function EventCard ({
    id,
    isActive,
    name,
    slug,
    description,
    durationInMinutes,
    location,
    visibility,
    bufferMinutes,
    profileHandle,
  }: EventCardProps) {
    const canCopy = isActive && visibility === "public"

    return (
        <Card className={cn("flex flex-col overflow-hidden transition-colors hover:border-primary/50", !canCopy && "bg-accent/50")}>
          {/* Card header with title and formatted duration */}
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="break-words font-display text-xl tracking-normal">{name}</CardTitle>
                <CardDescription className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 px-2.5 py-1">
                    <Clock3 className="size-3.5 text-primary" />
                    {formatEventDescription(durationInMinutes)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 px-2.5 py-1">
                    {canCopy ? (
                      <Eye className="size-3.5 text-primary" />
                    ) : (
                      <EyeOff className="size-3.5" />
                    )}
                    {canCopy ? "Public" : "Hidden"}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
    
          {/* Show event description if available */}
          {description && (
            <CardContent>
              <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </CardContent>
          )}

          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex min-w-0 items-center gap-2">
              <MapPin className="size-4 shrink-0 text-primary" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock className="size-4 shrink-0 text-primary" />
              {bufferMinutes > 0
                ? `${formatEventDescription(bufferMinutes)} buffer`
                : "No buffer"}
            </div>
          </CardContent>
    
          {/* Card footer with copy and edit buttons */}
          <CardFooter className="mt-auto flex justify-end gap-2 border-t border-border/80 pt-4">
            {/* Show copy button only if event is active */}
            {canCopy && (
              <CopyEventButton
                variant="outline"
                bookingPath={`/book/${profileHandle}/${slug ?? id}`}
              />
            )}
            {/* Edit event button */}
            <Button asChild>
              <Link href={`/events/${id}/edit`}>Edit</Link>
            </Button>
          </CardFooter>
        </Card>
      )

  }
