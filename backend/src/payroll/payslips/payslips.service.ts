import { PrismaService } from "@/prisma/prisma.service";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

const execFileAsync = promisify(execFile);
const PAYSLIP_TEMPLATE_NAME = "payslip_template.docx";
type DocxtemplaterDelimiters = { start: string; end: string };
type DocxtemplaterOptions = {
  paragraphLoop?: boolean;
  linebreaks?: boolean;
  delimiters?: DocxtemplaterDelimiters;
};
type DocxtemplaterZip = {
  generate: (options: { type: "nodebuffer" }) => Buffer;
};
type DocxtemplaterInstance = {
  render: (data: Record<string, string | number>) => void;
  getZip: () => DocxtemplaterZip;
};
type DocxtemplaterCtor = new (
  zip: unknown,
  options: DocxtemplaterOptions,
) => DocxtemplaterInstance;
type PizZipCtor = new (data: Buffer) => unknown;

@Injectable()
export class PayslipsService {
  constructor(private prisma: PrismaService) {}

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
            position: true,
            startDate: true,
            typeOfWork: true,
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!payroll) {
      throw new NotFoundException(
        `Payroll for user ${userId} in ${month}/${year} not found`,
      );
    }

    // Calculate totals
    const baseSalary = this.toNumber(payroll.baseSalary);
    const allowance = this.toNumber(payroll.allowance);
    const tax = this.toNumber(payroll.tax);
    const insurance = this.toNumber(payroll.insurance);
    const pensionFund = this.toNumber(payroll.pensionFund);
    const otherDeductions = this.toNumber(payroll.otherDeductions);
    const bonus = this.toNumber(payroll.bonuses);
    const hasBonus = bonus > 0;

    const totalEarning = baseSalary + allowance + (hasBonus ? bonus : 0) + tax;
    const totalDeduction = tax + insurance + pensionFund + otherDeductions;
    const takeHomePay = totalEarning - totalDeduction;

    const templatePath = this.resolveTemplatePath();
    const templateBuffer = await readFile(templatePath);
    const docxBuffer = this.renderPayslipDocx(templateBuffer, {
      username: payroll.user.fullName,
      month: this.formatMonth(month),
      year,
      baseSalary: this.formatCurrency(baseSalary),
      allowance: this.formatCurrency(allowance),
      tax: this.formatCurrency(tax),
      insurance: this.formatCurrency(insurance),
      pensionFund: this.formatCurrency(pensionFund),
      otherDeductions: this.formatCurrency(otherDeductions),
      Bonus: hasBonus ? "Bonus" : "",
      bonus: hasBonus ? `IDR ${this.formatCurrency(bonus)},00` : "",
      totalEarning: this.formatCurrency(totalEarning),
      totalDeduction: this.formatCurrency(totalDeduction),
      takeHomePay: this.formatCurrency(takeHomePay),
      designation: payroll.user.position ?? "",
      division: payroll.user.organization?.name ?? "",
      status: payroll.user.typeOfWork ?? "",
      joinedDate: this.formatJoinedDate(payroll.user.startDate),
    });

    return this.convertDocxToPdf(
      docxBuffer,
      `payslip-${userId}-${year}-${month}`,
    );
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
    const zip = new (PizZip as unknown as PizZipCtor)(templateBuffer);
    const doc = new (Docxtemplater as unknown as DocxtemplaterCtor)(zip, {
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

  private async runLibreOffice(
    docxPath: string,
    outDir: string,
  ): Promise<void> {
    const args = [
      "--headless",
      "--convert-to",
      "pdf",
      "--outdir",
      outDir,
      docxPath,
    ];

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
    const day = String(value.getDate()).padStart(2, "0");
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const year = value.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private formatJoinedDate(value: Date | null): string {
    if (!value) return "";
    const day = String(value.getDate()).padStart(2, "0");
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const year = value.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private formatCurrency(value: number): string {
    // Format with period as thousand separator (e.g., 2000000 -> "2.000.000")
    return Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  private formatMonth(month: number): string {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1] ?? "";
  }
}
