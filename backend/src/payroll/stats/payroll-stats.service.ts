import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class PayrollStatsService {
  constructor(private prisma: PrismaService) {}

  async getDepartmentTotals(
    month: number,
    year: number,
  ): Promise<
    {
      organizationId: number;
      organizationName: string;
      totalNetPay: number;
    }[]
  > {
    const rows = await this.prisma.$queryRaw<
      {
        organizationId: number;
        organizationName: string;
        totalNetPay: Prisma.Decimal | number | string | null;
      }[]
    >(Prisma.sql`
      SELECT
        o.id AS "organizationId",
        o.name AS "organizationName",
        COALESCE(SUM(p."baseSalary"), 0)
          + COALESCE(SUM(p."allowance"), 0)
          - COALESCE(SUM(p."tax"), 0)
          - COALESCE(SUM(p."insurance"), 0)
          - COALESCE(SUM(p."pensionFund"), 0)
          - COALESCE(SUM(p."otherDeductions"), 0) AS "totalNetPay"
      FROM "Organization" o
      LEFT JOIN "User" u ON u."organizationId" = o.id
      LEFT JOIN "Payroll" p
        ON p."userId" = u.id
       AND p."month" = ${month}
       AND p."year" = ${year}
      GROUP BY o.id, o.name
      ORDER BY o.name ASC
    `);

    return rows.map((row) => ({
      organizationId: row.organizationId,
      organizationName: row.organizationName,
      totalNetPay: this.toNumber(row.totalNetPay),
    }));
  }

  async getTotalForMonth(
    month: number,
    year: number,
  ): Promise<{ month: number; year: number; totalNetPay: number }> {
    const totals = await this.prisma.payroll.aggregate({
      where: {
        month,
        year,
      },
      _sum: {
        baseSalary: true,
        allowance: true,
        bonuses: true,
        tax: true,
        insurance: true,
        pensionFund: true,
        otherDeductions: true,
      },
    });

    const totalEarnings =
      this.toNumber(totals._sum.baseSalary) +
      this.toNumber(totals._sum.allowance) +
      this.toNumber(totals._sum.bonuses) +
      this.toNumber(totals._sum.tax);
    const totalDeductions =
      this.toNumber(totals._sum.tax) +
      this.toNumber(totals._sum.insurance) +
      this.toNumber(totals._sum.pensionFund) +
      this.toNumber(totals._sum.otherDeductions);

    return {
      month,
      year,
      totalNetPay: totalEarnings - totalDeductions,
    };
  }

  private toNumber(
    value: Prisma.Decimal | number | string | null | undefined,
  ): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return value;
    return Number(value);
  }
}
