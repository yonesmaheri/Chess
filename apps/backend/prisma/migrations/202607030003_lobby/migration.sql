-- CreateEnum
CREATE TYPE "LobbyInviteStatus" AS ENUM ('pending', 'accepted', 'rejected', 'expired');

-- CreateTable
CREATE TABLE "LobbyInvite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "recipientUserId" TEXT,
    "acceptedById" TEXT,
    "status" "LobbyInviteStatus" NOT NULL DEFAULT 'pending',
    "difficulty" INTEGER,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LobbyInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LobbyInvite_token_key" ON "LobbyInvite"("token");

-- CreateIndex
CREATE INDEX "LobbyInvite_token_idx" ON "LobbyInvite"("token");

-- CreateIndex
CREATE INDEX "LobbyInvite_creatorId_status_createdAt_idx" ON "LobbyInvite"("creatorId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "LobbyInvite_recipientUserId_status_idx" ON "LobbyInvite"("recipientUserId", "status");

-- CreateIndex
CREATE INDEX "LobbyInvite_acceptedById_idx" ON "LobbyInvite"("acceptedById");

-- AddForeignKey
ALTER TABLE "LobbyInvite"
ADD CONSTRAINT "LobbyInvite_creatorId_fkey"
FOREIGN KEY ("creatorId") REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LobbyInvite"
ADD CONSTRAINT "LobbyInvite_recipientUserId_fkey"
FOREIGN KEY ("recipientUserId") REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LobbyInvite"
ADD CONSTRAINT "LobbyInvite_acceptedById_fkey"
FOREIGN KEY ("acceptedById") REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
