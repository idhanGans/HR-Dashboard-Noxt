import { PrismaService } from "@/prisma/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PayrollResponseDto, UpsertPayrollDto } from "@/payroll/dto";
import { Payroll, Prisma } from "@prisma/client";

@Injectable()
export class PayrollsService {
  constructor(private prisma: PrismaService) {}

  async upsertByPeriod(
    userId: number,
    month: number,
    year: number,
    upsertPayrollDto: UpsertPayrollDto,
  ): Promise<PayrollResponseDto> {
    await this.ensureUserExists(userId);

    const updateData: Prisma.PayrollUpdateInput = {
      baseSalary: upsertPayrollDto.baseSalary,
    };

    if (upsertPayrollDto.allowance !== undefined) {
      updateData.allowance = upsertPayrollDto.allowance;
    }
    if (upsertPayrollDto.bonuses !== undefined) {
      updateData.bonuses = upsertPayrollDto.bonuses;
    }
    if (upsertPayrollDto.tax !== undefined) {
      updateData.tax = upsertPayrollDto.tax;
    }
    if (upsertPayrollDto.insurance !== undefined) {
      updateData.insurance = upsertPayrollDto.insurance;
    }
    if (upsertPayrollDto.pensionFund !== undefined) {
      updateData.pensionFund = upsertPayrollDto.pensionFund;
    }
    if (upsertPayrollDto.otherDeductions !== undefined) {
      updateData.otherDeductions = upsertPayrollDto.otherDeductions;
    }

    const payroll = await this.prisma.payroll.upsert({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
      create: {
        userId,
        month,
        year,
        baseSalary: upsertPayrollDto.baseSalary,
        allowance: upsertPayrollDto.allowance ?? 0,
        bonuses: upsertPayrollDto.bonuses ?? 0,
        tax: upsertPayrollDto.tax ?? 0,
        insurance: upsertPayrollDto.insurance ?? 0,
        pensionFund: upsertPayrollDto.pensionFund ?? 0,
        otherDeductions: upsertPayrollDto.otherDeductions ?? 0,
      },
      update: updateData,
    });

    return this.toPayrollResponse(payroll);
  }

  async findByPeriod(
    userId: number,
    month: number,
    year: number,
  ): Promise<PayrollResponseDto | null> {
    const payroll = await this.prisma.payroll.findUnique({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
    });

    if (!payroll) {
      return null;
    }

    return this.toPayrollResponse(payroll);
  }

  private async ensureUserExists(userId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  private toPayrollResponse(payroll: Payroll): PayrollResponseDto {
    const baseSalary = this.toNumber(payroll.baseSalary);
    const allowance = this.toNumber(payroll.allowance);
    const bonuses = this.toNumber(payroll.bonuses);
    const tax = this.toNumber(payroll.tax);
    const insurance = this.toNumber(payroll.insurance);
    const pensionFund = this.toNumber(payroll.pensionFund);
    const otherDeductions = this.toNumber(payroll.otherDeductions);

    const totalEarnings = baseSalary + allowance + bonuses;
    const totalDeductions = tax + insurance + pensionFund + otherDeductions;
    const netPay = totalEarnings - totalDeductions;

    return {
      id: payroll.id,
      userId: payroll.userId,
      month: payroll.month,
      year: payroll.year,
      baseSalary,
      allowance,
      bonuses,
      tax,
      insurance,
      pensionFund,
      otherDeductions,
      totalEarnings,
      totalDeductions,
      netPay,
      createdAt: payroll.createdAt,
      updatedAt: payroll.updatedAt,
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
