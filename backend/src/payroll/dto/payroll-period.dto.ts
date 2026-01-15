import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class PayrollPeriodDto {
  @ApiProperty({
    description: "Payroll Month",
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    description: "Payroll Year",
    example: 2024,
  })
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  year: number;
}
