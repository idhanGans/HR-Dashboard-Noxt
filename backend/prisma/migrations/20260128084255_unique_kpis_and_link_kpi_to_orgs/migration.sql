/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,name]` on the table `KpiMetric` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,name,startDate,endDate]` on the table `KpiPeriod` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `KpiMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `KpiPeriod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `KpiTarget` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "KpiPeriod_startDate_endDate_key";

-- AlterTable
ALTER TABLE "KpiMetric" ADD COLUMN     "organizationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "KpiPeriod" ADD COLUMN     "organizationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "KpiTarget" ADD COLUMN     "organizationId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "KpiMetric_organizationId_idx" ON "KpiMetric"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "KpiMetric_organizationId_name_key" ON "KpiMetric"("organizationId", "name");

-- CreateIndex
CREATE INDEX "KpiPeriod_organizationId_idx" ON "KpiPeriod"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "KpiPeriod_organizationId_name_startDate_endDate_key" ON "KpiPeriod"("organizationId", "name", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "KpiTarget_organizationId_idx" ON "KpiTarget"("organizationId");

-- AddForeignKey
ALTER TABLE "KpiMetric" ADD CONSTRAINT "KpiMetric_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KpiPeriod" ADD CONSTRAINT "KpiPeriod_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KpiTarget" ADD CONSTRAINT "KpiTarget_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
