/*
  Warnings:

  - You are about to drop the column `category` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `interests` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `careerGoal` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - The `preferredEventType` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `skills` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `interests` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `preferredMode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "category",
DROP COLUMN "interests",
DROP COLUMN "mode",
DROP COLUMN "skills",
ADD COLUMN     "cashPrize" DOUBLE PRECISION,
ADD COLUMN     "certificateAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "domain" TEXT,
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "organizerDepartment" TEXT,
ADD COLUMN     "organizerName" TEXT,
ADD COLUMN     "posterUrl" TEXT,
ADD COLUMN     "registrationDeadline" TIMESTAMP(3),
ADD COLUMN     "registrationFee" DOUBLE PRECISION,
ADD COLUMN     "startTime" TEXT,
ADD COLUMN     "whatsappGroupLink" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "careerGoal",
DROP COLUMN "location",
ADD COLUMN     "preferredMode" TEXT NOT NULL,
DROP COLUMN "preferredEventType",
ADD COLUMN     "preferredEventType" TEXT[],
DROP COLUMN "skills",
ADD COLUMN     "skills" TEXT[],
DROP COLUMN "interests",
ADD COLUMN     "interests" TEXT[];
