/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passwordHash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BehaviorFrequency" AS ENUM ('DAILY', 'WEEKDAYS', 'WEEKENDS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "BehaviorCategory" AS ENUM ('HEALTH', 'FITNESS', 'LEARNING', 'MINDFULNESS', 'PRODUCTIVITY', 'SOCIAL', 'OTHER');

-- AlterTable
ALTER TABLE "behaviors" ADD COLUMN     "category" "BehaviorCategory" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "frequency" "BehaviorFrequency" NOT NULL DEFAULT 'DAILY';

-- AlterTable
ALTER TABLE "users"
ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "passwordHash" TEXT NOT NULL DEFAULT 'PLACEHOLDER_HASH',
ADD COLUMN "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN "resetPasswordToken" TEXT,
ADD COLUMN "username" TEXT NOT NULL DEFAULT 'placeholder_user',
ADD COLUMN "verificationToken" TEXT,
ADD COLUMN "verificationTokenExpires" TIMESTAMP(3);

ALTER TABLE "users" ALTER COLUMN "passwordHash" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "username" DROP DEFAULT;

DELETE FROM "users";

-- CreateIndex
CREATE INDEX "behaviors_archivedAt_idx" ON "behaviors"("archivedAt");

-- CreateIndex
CREATE INDEX "events_behaviorId_occurredAt_idx" ON "events"("behaviorId", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");
