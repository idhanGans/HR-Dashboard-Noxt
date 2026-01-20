-- CreateTable
CREATE TABLE "KpiMetric" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KpiMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KpiPeriod" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KpiPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KpiTarget" (
    "id" SERIAL NOT NULL,
    "metricId" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,
    "target" DECIMAL(3,1) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KpiTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KpiScore" (
    "id" SERIAL NOT NULL,
    "periodId" INTEGER NOT NULL,
    "metricId" INTEGER NOT NULL,
    "scoredUserId" INTEGER NOT NULL,
    "scorerId" INTEGER NOT NULL,
    "score" DECIMAL(3,1) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KpiScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KpiMetric_isActive_idx" ON "KpiMetric"("isActive");

-- CreateIndex
CREATE INDEX "KpiPeriod_isActive_idx" ON "KpiPeriod"("isActive");

-- CreateIndex
CREATE INDEX "KpiPeriod_startDate_endDate_idx" ON "KpiPeriod"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "KpiPeriod_startDate_endDate_key" ON "KpiPeriod"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "KpiTarget_periodId_idx" ON "KpiTarget"("periodId");

-- CreateIndex
CREATE INDEX "KpiTarget_metricId_idx" ON "KpiTarget"("metricId");

-- CreateIndex
CREATE UNIQUE INDEX "KpiTarget_metricId_periodId_key" ON "KpiTarget"("metricId", "periodId");

-- CreateIndex
CREATE INDEX "KpiScore_periodId_idx" ON "KpiScore"("periodId");

-- CreateIndex
CREATE INDEX "KpiScore_scoredUserId_idx" ON "KpiScore"("scoredUserId");

-- CreateIndex
CREATE INDEX "KpiScore_scorerId_idx" ON "KpiScore"("scorerId");

-- CreateIndex
CREATE INDEX "KpiScore_metricId_idx" ON "KpiScore"("metricId");

-- CreateIndex
CREATE UNIQUE INDEX "KpiScore_periodId_metricId_scoredUserId_scorerId_key" ON "KpiScore"("periodId", "metricId", "scoredUserId", "scorerId");

-- AddForeignKey
ALTER TABLE "KpiTarget" ADD CONSTRAINT "KpiTarget_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "KpiMetric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KpiTarget" ADD CONSTRAINT "KpiTarget_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "KpiPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KpiScore" ADD CONSTRAINT "KpiScore_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "KpiPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KpiScore" ADD CONSTRAINT "KpiScore_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "KpiMetric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KpiScore" ADD CONSTRAINT "KpiScore_scoredUserId_fkey" FOREIGN KEY ("scoredUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KpiScore" ADD CONSTRAINT "KpiScore_scorerId_fkey" FOREIGN KEY ("scorerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
