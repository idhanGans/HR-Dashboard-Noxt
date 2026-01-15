import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Min, Max, IsInt, IsOptional } from "class-validator";

export enum PayrollStatus {
  PROCESSED
}

export class CreatePayrollDto {
    @ApiProperty({
        description: "Base Salary",
        example: 100000
    })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    baseSalary: number;

    @ApiPropertyOptional({
        description: "Allowance", 
        example: 1000
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    allowance?: number;

    @ApiPropertyOptional({
        description: "Bonuses",
        example: 500
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    bonuses?: number;

    @ApiProperty({
        description: "Tax",
        example: 1000
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    tax?: number;

    @ApiPropertyOptional({
        description: "Insurance",
        example: 200
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    insurance?: number;

    @ApiPropertyOptional({
        description: "Pension Fund",
        example: 300
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    pensionFund?: number;
    
    @ApiPropertyOptional({ 
        description: "Other Deductions",
        example: 150
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    otherDeductions?: number;

    @ApiProperty({
        description: "Payroll Month",
        example: 1, //TODO: FE Handle month
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