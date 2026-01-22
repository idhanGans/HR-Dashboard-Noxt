import { ApiProperty } from "@nestjs/swagger";

export class DepartmentPayrollTotalDto {
  @ApiProperty({ example: 1 })
  organizationId: number;

  @ApiProperty({ example: "Engineering" })
  organizationName: string;

  @ApiProperty({ example: 125000 })
  totalNetPay: number;
}

export class PayrollTotalDto {
  @ApiProperty({ example: 1 })
  month: number;

  @ApiProperty({ example: 2024 })
  year: number;

  @ApiProperty({ example: 250000 })
  totalNetPay: number;
}
