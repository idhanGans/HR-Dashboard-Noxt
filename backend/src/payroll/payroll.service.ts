import { PrismaService } from "@/prisma/prisma.service";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CreatePayrollDto,
  PayrollResponseDto,
  UpdatePayrollDto,
} from "@/payroll/dto";
import { Payroll, Prisma } from "@prisma/client";
@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    createPayrollDto: CreatePayrollDto,
  ): Promise<PayrollResponseDto> {
    await this.ensureUserExists(userId);

    try {
      const payroll = await this.prisma.payroll.create({
        data: {
          userId,
          month: createPayrollDto.month,
          year: createPayrollDto.year,
          baseSalary: createPayrollDto.baseSalary,
          allowance: createPayrollDto.allowance ?? 0,
          bonuses: createPayrollDto.bonuses ?? 0,
          tax: createPayrollDto.tax ?? 0,
          insurance: createPayrollDto.insurance ?? 0,
          pensionFund: createPayrollDto.pensionFund ?? 0,
          otherDeductions: createPayrollDto.otherDeductions ?? 0,
        },
      });

      return this.toPayrollResponse(payroll);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException(
          `Payroll for user ${userId} in ${createPayrollDto.month}/${createPayrollDto.year} already exists`,
        );
      }
      throw error;
    }
  }

  async updateByPeriod(
    userId: number,
    month: number,
    year: number,
    updatePayrollDto: UpdatePayrollDto,
  ): Promise<PayrollResponseDto> {
    await this.ensureUserExists(userId);

    const existing = await this.prisma.payroll.findUnique({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `Payroll for user ${userId} in ${month}/${year} not found`,
      );
    }

    const updateData: Prisma.PayrollUpdateInput = {};

    if (updatePayrollDto.baseSalary !== undefined) {
      updateData.baseSalary = updatePayrollDto.baseSalary;
    }
    if (updatePayrollDto.allowance !== undefined) {
      updateData.allowance = updatePayrollDto.allowance;
    }
    if (updatePayrollDto.bonuses !== undefined) {
      updateData.bonuses = updatePayrollDto.bonuses;
    }
    if (updatePayrollDto.tax !== undefined) {
      updateData.tax = updatePayrollDto.tax;
    }
    if (updatePayrollDto.insurance !== undefined) {
      updateData.insurance = updatePayrollDto.insurance;
    }
    if (updatePayrollDto.pensionFund !== undefined) {
      updateData.pensionFund = updatePayrollDto.pensionFund;
    }
    if (updatePayrollDto.otherDeductions !== undefined) {
      updateData.otherDeductions = updatePayrollDto.otherDeductions;
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException("No payroll fields provided for update");
    }

    const payroll = await this.prisma.payroll.update({
      where: { id: existing.id },
      data: updateData,
    });

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
      status: payroll.status,
      createdAt: payroll.createdAt,
      updatedAt: payroll.updatedAt,
    };
  }

  private toNumber(
    value: Prisma.Decimal | number | null | undefined,
  ): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return value;
    return Number(value);
  }
}
