import { ApiProperty } from "@nestjs/swagger";
import { PayrollStatus } from "@prisma/client";

export class PayrollResponseDto {
  @ApiProperty({
    description: "Payroll ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "User ID",
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: "Payroll Month",
    example: 1,
  })
  month: number;

  @ApiProperty({
    description: "Payroll Year",
    example: 2024,
  })
  year: number;

  @ApiProperty({
    description: "Base Salary",
    example: 100000,
  })
  baseSalary: number;

  @ApiProperty({
    description: "Allowance",
    example: 1000,
  })
  allowance: number;

  @ApiProperty({
    description: "Bonuses",
    example: 500,
  })
  bonuses: number;

  @ApiProperty({
    description: "Tax",
    example: 1000,
  })
  tax: number;

  @ApiProperty({
    description: "Insurance",
    example: 200,
  })
  insurance: number;

  @ApiProperty({
    description: "Pension Fund",
    example: 300,
  })
  pensionFund: number;

  @ApiProperty({
    description: "Other Deductions",
    example: 150,
  })
  otherDeductions: number;

  @ApiProperty({
    description: "Total Earnings (base + allowance + bonuses)",
    example: 101500,
  })
  totalEarnings: number;

  @ApiProperty({
    description: "Total Deductions (tax + insurance + pension + other)",
    example: 1650,
  })
  totalDeductions: number;

  @ApiProperty({
    description: "Net Pay (earnings - deductions)",
    example: 99850,
  })
  netPay: number;

  @ApiProperty({
    description: "Payroll Status",
    enum: PayrollStatus,
    example: PayrollStatus.PROCESSED,
  })
  status: PayrollStatus;

  @ApiProperty({
    description: "Created at",
    example: "2024-01-01T00:00:00Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Updated at",
    example: "2024-01-01T00:00:00Z",
  })
  updatedAt: Date;
}
