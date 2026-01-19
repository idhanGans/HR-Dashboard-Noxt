import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsInt, IsDateString, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class TrendsQueryDto {
  @ApiProperty({
    description: "Start date for trend analysis",
    example: "2024-01-01T00:00:00Z",
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: "End date for trend analysis",
    example: "2024-12-31T23:59:59Z",
  })
  @IsDateString()
  @IsNotEmpty()
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

export class TopPerformerEmployeeDto {
  @ApiProperty({ description: "User ID", example: 1 })
  userId: number;

  @ApiProperty({ description: "User full name", example: "John Doe" })
  userName: string;

  @ApiPropertyOptional({
    description: "Department name",
    example: "Engineering Team",
  })
  departmentName?: string;

  @ApiPropertyOptional({
    description: "User role",
    example: "Senior Developer",
  })
  role?: string;

  @ApiProperty({ description: "Average KPI score", example: 8.5 })
  averageScore: number;

  @ApiPropertyOptional({
    description: "Performance trend",
    example: "+5%",
  })
  trend?: string;
}

export class TopPerformersResponseDto {
  @ApiProperty({
    description: "Top performing employees",
    type: [TopPerformerEmployeeDto],
  })
  performers: TopPerformerEmployeeDto[];

  @ApiProperty({ description: "Period ID", example: 1 })
  periodId: number;

  @ApiProperty({ description: "Limit used", example: 3 })
  limit: number;
}

export class PerformanceInsightDto {
  @ApiProperty({ description: "Department name", example: "Engineering Team" })
  departmentName: string;

  @ApiProperty({ description: "Score or improvement value", example: "8.9/10" })
  score?: string;

  @ApiPropertyOptional({
    description: "Improvement percentage",
    example: "+5% improvement this month",
  })
  improvement?: string;

  @ApiPropertyOptional({
    description: "Note about the department",
    example: "Below target performance",
  })
  note?: string;
}

export class PerformanceInsightsResponseDto {
  @ApiProperty({
    description: "Top performing department",
    type: PerformanceInsightDto,
  })
  topPerformer: PerformanceInsightDto;

  @ApiProperty({
    description: "Most improved department",
    type: PerformanceInsightDto,
  })
  mostImproved: PerformanceInsightDto;

  @ApiProperty({
    description: "Department needing attention",
    type: PerformanceInsightDto,
  })
  needsAttention: PerformanceInsightDto;

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

export class OverallQueryDto {
  @ApiPropertyOptional({
    description: "Period ID (defaults to current active period)",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  periodId?: number;
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

export class DepartmentsQueryDto {
  @ApiPropertyOptional({
    description: "Period ID (defaults to current active period)",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  periodId?: number;
}

export class TopPerformersQueryDto {
  @ApiPropertyOptional({
    description: "Limit of top performers to return",
    example: 3,
    default: 3,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: "Period ID (defaults to current active period)",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  periodId?: number;
}

export class InsightsQueryDto {
  @ApiPropertyOptional({
    description: "Period ID (defaults to current active period)",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  periodId?: number;
}
