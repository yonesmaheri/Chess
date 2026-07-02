-- CreateEnum
CREATE TYPE "LeaderboardMode" AS ENUM ('blitz', 'rapid', 'puzzle');

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" TEXT NOT NULL,
    "mode" "LeaderboardMode" NOT NULL,
    "rank" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL DEFAULT 'IR',
    "countryName" TEXT NOT NULL DEFAULT 'ایران',
    "elo" INTEGER NOT NULL,
    "winRate" DOUBLE PRECISION NOT NULL,
    "trend" DOUBLE PRECISION NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_mode_rank_key" ON "LeaderboardEntry"("mode", "rank");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_mode_rank_idx" ON "LeaderboardEntry"("mode", "rank");
