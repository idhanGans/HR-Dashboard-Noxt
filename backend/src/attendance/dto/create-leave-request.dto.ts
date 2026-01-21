import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { LeaveType } from "@prisma/client";

export class CreateLeaveRequestDto {
  @ApiProperty({
    description: "Leave type",
    enum: LeaveType,
    example: LeaveType.PAID_LEAVE,
  })
  @IsEnum(LeaveType)
  @IsNotEmpty()
  type: LeaveType;

  @ApiProperty({
    description: "Leave start date",
    example: "2024-02-10T00:00:00Z",
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: "Leave end date",
    example: "2024-02-12T23:59:59Z",
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({
    description: "Reason for leave",
    example: "Family event",
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
