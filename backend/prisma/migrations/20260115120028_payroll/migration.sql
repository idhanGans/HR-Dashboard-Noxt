-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('PROCESSED');

-- CreateTable
CREATE TABLE "Payroll" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "baseSalary" DECIMAL(65,30) NOT NULL,
    "allowance" DECIMAL(65,30) DEFAULT 0,
    "bonuses" DECIMAL(65,30) DEFAULT 0,
    "tax" DECIMAL(65,30) DEFAULT 0,
    "insurance" DECIMAL(65,30) DEFAULT 0,
    "pensionFund" DECIMAL(65,30) DEFAULT 0,
    "otherDeductions" DECIMAL(65,30) DEFAULT 0,
    "status" "PayrollStatus" NOT NULL DEFAULT 'PROCESSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payroll_userId_idx" ON "Payroll"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Payroll_userId_month_year_key" ON "Payroll"("userId", "month", "year");

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
