import { PrismaService } from "@/prisma/prisma.service";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
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
const PAYSLIP_TEMPLATE_NAME = "payslip-template.docx";

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
