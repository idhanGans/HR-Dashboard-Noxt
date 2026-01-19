import { PrismaService } from "@/prisma/prisma.service";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import {
  CreatePayrollDto,
  PayrollResponseDto,
  UpdatePayrollDto,
} from "@/payroll/dto";
import { Payroll, Prisma } from "@prisma/client";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

const execFileAsync = promisify(execFile);
const PAYSLIP_TEMPLATE_NAME = "payslip-template.docx";

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

  async findByPeriod(
    userId: number,
    month: number,
    year: number,
  ): Promise<PayrollResponseDto> {
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
      throw new NotFoundException(
        `Payroll for user ${userId} in ${month}/${year} not found`,
      );
    }

    return this.toPayrollResponse(payroll);
  }

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
          + COALESCE(SUM(p."bonuses"), 0)
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
      this.toNumber(totals._sum.bonuses);
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

  async generatePayslipPdf(
    userId: number,
    month: number,
    year: number,
  ): Promise<Buffer> {
    const payroll = await this.prisma.payroll.findUnique({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    if (!payroll) {
      throw new NotFoundException(
        `Payroll for user ${userId} in ${month}/${year} not found`,
      );
    }

    const templatePath = this.resolveTemplatePath();
    const templateBuffer = await readFile(templatePath);
    const docxBuffer = this.renderPayslipDocx(templateBuffer, {
      username: payroll.user.fullName,
      month,
      year,
      baseSalary: this.toNumber(payroll.baseSalary),
      allowance: this.toNumber(payroll.allowance),
      bonuses: this.toNumber(payroll.bonuses),
      tax: this.toNumber(payroll.tax),
      insurance: this.toNumber(payroll.insurance),
      pensionFund: this.toNumber(payroll.pensionFund),
      otherDeductions: this.toNumber(payroll.otherDeductions),
      createdAt: this.formatDate(payroll.createdAt),
      updatedAt: this.formatDate(payroll.updatedAt),
    });

    return this.convertDocxToPdf(docxBuffer, `payslip-${userId}-${year}-${month}`);
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
    value: Prisma.Decimal | number | string | null | undefined,
  ): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return value;
    return Number(value);
  }

  private resolveTemplatePath(): string {
    const candidates = [
      path.resolve(process.cwd(), "src/template", PAYSLIP_TEMPLATE_NAME),
      path.resolve(
        process.cwd(),
        "backend/src/template",
        PAYSLIP_TEMPLATE_NAME,
      ),
      path.resolve(process.cwd(), "dist/src/template", PAYSLIP_TEMPLATE_NAME),
      path.resolve(
        process.cwd(),
        "backend/dist/src/template",
        PAYSLIP_TEMPLATE_NAME,
      ),
    ];

    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return candidate;
      }
    }

    throw new InternalServerErrorException(
      `Payslip template not found. Expected ${PAYSLIP_TEMPLATE_NAME} in src/template.`,
    );
  }

  private renderPayslipDocx(
    templateBuffer: Buffer,
    data: Record<string, string | number>,
  ): Buffer {
    const zip = new PizZip(templateBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: "{", end: "}" },
    });

    doc.render(data);

    return doc.getZip().generate({ type: "nodebuffer" });
  }

  private async convertDocxToPdf(
    docxBuffer: Buffer,
    baseName: string,
  ): Promise<Buffer> {
    const tempDir = await mkdtemp(path.join(tmpdir(), "payslip-"));
    try {
      const docxPath = path.join(tempDir, `${baseName}.docx`);
      await writeFile(docxPath, docxBuffer);
      await this.runLibreOffice(docxPath, tempDir);
      const pdfPath = path.join(tempDir, `${baseName}.pdf`);
      return await readFile(pdfPath);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  }

  private async runLibreOffice(docxPath: string, outDir: string): Promise<void> {
    const args = ["--headless", "--convert-to", "pdf", "--outdir", outDir, docxPath];

    try {
      await execFileAsync("soffice", args);
      return;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }

    try {
      await execFileAsync("libreoffice", args);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        throw new InternalServerErrorException(
          "LibreOffice not found. Install LibreOffice or expose soffice in PATH.",
        );
      }
      throw error;
    }
  }

  private formatDate(value: Date): string {
    return value.toISOString().split("T")[0];
  }
}
