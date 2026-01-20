import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional } from "class-validator";
import { PaginationQueryDto } from "@/common/dto";

export class AttendanceRecordsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: "Filter by user ID", example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

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
}
