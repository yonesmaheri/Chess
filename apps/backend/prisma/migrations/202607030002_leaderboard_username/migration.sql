ALTER TABLE "LeaderboardEntry"
ADD COLUMN "username" TEXT;

UPDATE "LeaderboardEntry"
SET "username" = CONCAT("mode"::text, '-', "rank"::text)
WHERE "username" IS NULL;

ALTER TABLE "LeaderboardEntry"
ALTER COLUMN "username" SET NOT NULL;

CREATE UNIQUE INDEX "LeaderboardEntry_username_key"
ON "LeaderboardEntry"("username");
