import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class DashboardOverviewQueryDto {
  @ApiPropertyOptional({
    description:
      "IANA timezone name used for date bucketing (e.g. Asia/Jakarta)",
    example: "Asia/Jakarta",
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: "Number of months to include (default: 12)",
    example: 12,
    minimum: 1,
    maximum: 24,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  months?: number;
}

export class DashboardMonthlyAttendanceDto {
  @ApiProperty({ example: "Feb 2026" })
  month: string;

  @ApiProperty({
    description: "Total present attendance records in the month",
    example: 287,
  })
  present: number;

  @ApiProperty({
    description: "Total absent attendance records in the month",
    example: 10,
  })
  absent: number;

  @ApiProperty({
    description: "Total late attendance records in the month",
    example: 15,
  })
  late: number;
}

export class DashboardKpiTrendPointDto {
  @ApiProperty({ example: "Feb 2026" })
  month: string;

  @ApiProperty({ example: 8.7 })
  value: number;
}

export class DashboardTopPerformerDto {
  @ApiProperty({ example: 123 })
  userId: number;

  @ApiProperty({ example: "Jane Employee" })
  userName: string;

  @ApiPropertyOptional({ example: "Engineering Department" })
  departmentName?: string;

  @ApiPropertyOptional({ example: "Software Developer" })
  role?: string;

  @ApiProperty({ example: 9.2 })
  averageScore: number;

  @ApiPropertyOptional({ example: "+3%" })
  trend?: string;
}

export class DashboardOverviewResponseDto {
  @ApiProperty({ example: 312 })
  totalEmployees: number;

  @ApiProperty({
    description: "Count of users who checked in today (PRESENT or LATE)",
    example: 301,
  })
  todayAttendance: number;

  @ApiProperty({
    description:
      "Overall KPI score for the latest available period (current active if present)",
    example: 8.7,
  })
  averageKpi: number;

  @ApiPropertyOptional({
    description: "KPI period ID used for average/top performers",
    example: 42,
  })
  kpiPeriodId?: number;

  @ApiPropertyOptional({
    description: "KPI period name used for average/top performers",
    example: "January 2026",
  })
  kpiPeriodName?: string;

  @ApiProperty({ example: "Asia/Jakarta" })
  timezone: string;

  @ApiProperty({ example: 12 })
  months: number;

  @ApiProperty({ type: DashboardMonthlyAttendanceDto, isArray: true })
  monthlyAttendance: DashboardMonthlyAttendanceDto[];

  @ApiProperty({ type: DashboardKpiTrendPointDto, isArray: true })
  kpiTrend: DashboardKpiTrendPointDto[];

  @ApiProperty({ type: DashboardTopPerformerDto, isArray: true })
  topPerformers: DashboardTopPerformerDto[];
}
