-- CreateTable
CREATE TABLE "OrgChartNode" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT,
    "parentId" INTEGER,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrgChartNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrgChartNode_parentId_idx" ON "OrgChartNode"("parentId");

-- CreateIndex
CREATE INDEX "OrgChartNode_userId_idx" ON "OrgChartNode"("userId");

-- AddForeignKey
ALTER TABLE "OrgChartNode" ADD CONSTRAINT "OrgChartNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "OrgChartNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgChartNode" ADD CONSTRAINT "OrgChartNode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
