CREATE TYPE "public"."bookingStatus" AS ENUM('confirmed', 'canceled');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerkUserId" text NOT NULL,
	"eventId" uuid,
	"eventName" text NOT NULL,
	"eventSlug" text,
	"eventDurationInMinutes" integer NOT NULL,
	"eventLocation" text,
	"guestName" text NOT NULL,
	"guestEmail" text NOT NULL,
	"guestNotes" text,
	"timezone" text NOT NULL,
	"startTime" timestamp NOT NULL,
	"endTime" timestamp NOT NULL,
	"googleCalendarEventId" text,
	"googleCalendarHtmlLink" text,
	"status" "bookingStatus" DEFAULT 'confirmed' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_eventId_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookingsClerkUserIdStartTimeIndex" ON "bookings" USING btree ("clerkUserId","startTime");--> statement-breakpoint
CREATE INDEX "bookingsEventIdIndex" ON "bookings" USING btree ("eventId");