import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsOptional } from "class-validator";
import { PaginationQueryDto } from "@/common/dto";
import { LeaveStatus } from "@prisma/client";

export class LeaveRequestsQueryDto extends OmitType(PaginationQueryDto, [
  "search",
] as const ) {
  @ApiPropertyOptional({ description: "Filter by user ID", example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @ApiPropertyOptional({
    description: "Filter by leave status",
    enum: LeaveStatus,
    example: LeaveStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(LeaveStatus)
  status?: LeaveStatus;

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

export class LeaveRequestsMeQueryDto extends OmitType(LeaveRequestsQueryDto, [
  "userId",
] as const) {}
