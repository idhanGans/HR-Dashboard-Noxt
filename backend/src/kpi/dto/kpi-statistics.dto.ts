import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsEnum, IsInt } from "class-validator";
import { Type } from "class-transformer";

export enum AverageChangeScope {
  EMPLOYEE = "employee",
  DEPARTMENT = "department",
  COMPANY = "company",
}

export class AverageChangeQueryDto {
  @ApiPropertyOptional({
    description: "Scope of average change calculation",
    enum: AverageChangeScope,
    default: AverageChangeScope.COMPANY,
  })
  @IsOptional()
  @IsEnum(AverageChangeScope)
  scope?: AverageChangeScope;

  @ApiPropertyOptional({
    description: "Employee ID (required if scope=employee)",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  employeeId?: number;

  @ApiPropertyOptional({
    description: "Department ID (required if scope=department)",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  departmentId?: number;
}

export class TrendsQueryDto {
  @ApiProperty({
    description: "Start date for trend analysis",
    example: "2024-01-01T00:00:00Z",
  })
  startDate: string;

  @ApiProperty({
    description: "End date for trend analysis",
    example: "2024-12-31T23:59:59Z",
  })
  endDate: string;

  @ApiPropertyOptional({
    description: "Department ID to filter trends",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  departmentId?: number;
}

export class AverageChangeResponseDto {
  @ApiProperty({
    description: "Average change percentage",
    example: 5.2,
  })
  averageChange: number;

  @ApiProperty({
    description: "Current period average",
    example: 8.5,
  })
  currentAverage: number;

  @ApiProperty({
    description: "Previous period average",
    example: 8.1,
  })
  previousAverage: number;

  @ApiPropertyOptional({
    description: "Employee ID (if scope=employee)",
    example: 1,
  })
  employeeId?: number;

  @ApiPropertyOptional({
    description: "Department ID (if scope=department)",
    example: 1,
  })
  departmentId?: number;
}

export class TrendDataPointDto {
  @ApiProperty({ description: "Period ID", example: 1 })
  periodId: number;

  @ApiProperty({ description: "Period name", example: "January 2024" })
  periodName: string;

  @ApiProperty({ description: "Average score for this period", example: 8.5 })
  averageScore: number;
}

export class TrendsResponseDto {
  @ApiProperty({
    description: "Trend data points",
    type: [TrendDataPointDto],
  })
  trends: TrendDataPointDto[];

  @ApiPropertyOptional({
    description: "Department ID (if filtered)",
    example: 1,
  })
  departmentId?: number;
}

export class DepartmentKpiDto {
  @ApiProperty({ description: "Department ID", example: 1 })
  departmentId: number;

  @ApiProperty({ description: "Department name", example: "Engineering Team" })
  departmentName: string;

  @ApiProperty({ description: "Average KPI score", example: 8.5 })
  averageScore: number;

  @ApiProperty({ description: "Target score", example: 8.0 })
  targetScore: number;

  @ApiProperty({ description: "Period ID", example: 1 })
  periodId: number;
}

export class DepartmentsResponseDto {
  @ApiProperty({
    description: "Department KPI data",
    type: [DepartmentKpiDto],
  })
  departments: DepartmentKpiDto[];

  @ApiProperty({ description: "Period ID", example: 1 })
  periodId: number;
}

export class TopPerformingResponseDto {
  @ApiProperty({
    description: "Top performing departments",
    type: [DepartmentKpiDto],
  })
  departments: DepartmentKpiDto[];

  @ApiProperty({ description: "Period ID", example: 1 })
  periodId: number;
}

export class MostImprovedResponseDto {
  @ApiProperty({
    description: "Most improved department",
    type: DepartmentKpiDto,
  })
  department: DepartmentKpiDto;

  @ApiProperty({
    description: "Improvement percentage",
    example: 15.5,
  })
  improvementPercentage: number;

  @ApiProperty({ description: "Current period ID", example: 2 })
  currentPeriodId: number;

  @ApiProperty({ description: "Previous period ID", example: 1 })
  previousPeriodId: number;
}

export class RequiresAttentionResponseDto {
  @ApiProperty({
    description: "Departments requiring attention",
    type: [DepartmentKpiDto],
  })
  departments: DepartmentKpiDto[];

  @ApiProperty({ description: "Period ID", example: 1 })
  periodId: number;
}

export class CompanyOverallResponseDto {
  @ApiProperty({
    description: "Overall company KPI score",
    example: 8.3,
  })
  overallScore: number;

  @ApiProperty({ description: "Period ID", example: 1 })
  periodId: number;

  @ApiProperty({ description: "Total number of departments", example: 5 })
  totalDepartments: number;
}
