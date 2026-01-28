/*
  Warnings:

  - You are about to drop the column `roleName` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "TypeOfWork" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE');

-- CreateEnum
CREATE TYPE "WorkStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('JUNIOR', 'MID', 'SENIOR', 'LEAD', 'MANAGER', 'DIRECTOR');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roleName",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "division" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "level" "Level",
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "typeOfWork" "TypeOfWork",
ADD COLUMN     "workStatus" "WorkStatus";
