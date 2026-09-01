CREATE TYPE "public"."eventVisibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "userProfiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerkUserId" text NOT NULL,
	"handle" text NOT NULL,
	"displayName" text NOT NULL,
	"avatarUrl" text,
	"headline" text,
	"bio" text,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"location" text,
	"accent" text DEFAULT 'lime' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "location" text DEFAULT 'Google Meet' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "visibility" "eventVisibility" DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "bufferMinutes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
WITH normalized_events AS (
	SELECT
		"id",
		"clerkUserId",
		COALESCE(
			NULLIF(
				TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER("name"), '[^a-z0-9]+', '-', 'g')),
				''
			),
			'event'
		) AS "baseSlug",
		"createdAt"
	FROM "events"
),
ranked_events AS (
	SELECT
		"id",
		"baseSlug",
		ROW_NUMBER() OVER (
			PARTITION BY "clerkUserId", "baseSlug"
			ORDER BY "createdAt", "id"
		) AS "slugRank"
	FROM normalized_events
)
UPDATE "events"
SET "slug" = CASE
	WHEN ranked_events."slugRank" = 1 THEN ranked_events."baseSlug"
	ELSE ranked_events."baseSlug" || '-' || ranked_events."slugRank"
END
FROM ranked_events
WHERE "events"."id" = ranked_events."id";--> statement-breakpoint
CREATE UNIQUE INDEX "userProfilesClerkUserIdUnique" ON "userProfiles" USING btree ("clerkUserId");--> statement-breakpoint
CREATE UNIQUE INDEX "userProfilesHandleUnique" ON "userProfiles" USING btree ("handle");--> statement-breakpoint
CREATE UNIQUE INDEX "eventsClerkUserIdSlugUnique" ON "events" USING btree ("clerkUserId","slug");
