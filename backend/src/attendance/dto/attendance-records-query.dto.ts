import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
import { PaginationQueryDto } from "@/common/dto";
import { AttendanceStatus } from "@prisma/client";

export class AttendanceRecordsQueryDto extends OmitType(PaginationQueryDto, [
  "search",
] as const) {
  @ApiPropertyOptional({
    description: "Filter by start date (ISO)",
    example: "2024-02-01T00:00:00Z",
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: "Filter by end date (ISO)",
    example: "2024-02-28T23:59:59Z",
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: "Filter by attendance status",
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
  })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @ApiPropertyOptional({
    description: "Filter by month (1-12). Requires year to be set.",
    example: 2,
    minimum: 1,
    maximum: 12,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @ApiPropertyOptional({
    description: "Filter by year. Requires month to be set.",
    example: 2026,
    minimum: 2020,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2020)
  year?: number;

  @ApiPropertyOptional({
    description: "Filter by user ID",
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;
}
