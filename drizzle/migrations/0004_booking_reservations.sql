CREATE TABLE "bookingReservations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"clerkUserId" text NOT NULL,
	"startTime" timestamp NOT NULL,
	"endTime" timestamp NOT NULL,
	"requestHash" text NOT NULL,
	"payload" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS btree_gist;
--> statement-breakpoint
ALTER TABLE "bookingReservations" ADD CONSTRAINT "bookingReservationPositiveRange"
  CHECK ("endTime" > "startTime");
--> statement-breakpoint
ALTER TABLE "bookingReservations" ADD CONSTRAINT "bookingReservationsNoOverlap"
  EXCLUDE USING gist (
    "clerkUserId" WITH =,
    tsrange("startTime", "endTime", '[)') WITH &&
  );
