import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { LeaveStatus, LeaveType } from "@prisma/client";

export class LeaveUserSummaryDto {
  @ApiProperty({ description: "User ID", example: 1 })
  id: number;

  @ApiProperty({ description: "User full name", example: "John Doe" })
  fullName: string;

  @ApiProperty({ description: "User email", example: "john.doe@example.com" })
  email: string;
}

export class LeaveRequestResponseDto {
  @ApiProperty({ description: "Leave request ID", example: 1 })
  id: number;

  @ApiProperty({ description: "User ID", example: 1 })
  userId: number;

  @ApiProperty({
    description: "Leave type",
    enum: LeaveType,
    example: LeaveType.PAID_LEAVE,
  })
  type: LeaveType;

  @ApiProperty({
    description: "Reason",
    example: "Medical appointment",
  })
  reason: string;

  @ApiProperty({
    description: "Start date",
    example: "2024-02-10T00:00:00Z",
  })
  startDate: Date;

  @ApiProperty({
    description: "End date",
    example: "2024-02-12T23:59:59Z",
  })
  endDate: Date;

  @ApiProperty({
    description: "Leave status",
    enum: LeaveStatus,
    example: LeaveStatus.PENDING,
  })
  status: LeaveStatus;

  @ApiProperty({
    description: "Total leave days (inclusive)",
    example: 3,
  })
  days: number;

  @ApiPropertyOptional({ description: "Reviewer user ID", example: 2 })
  reviewedById?: number | null;

  @ApiPropertyOptional({
    description: "Reviewed at",
    example: "2024-02-09T12:00:00Z",
  })
  reviewedAt?: Date | null;

  @ApiPropertyOptional({
    description: "Request user",
    type: LeaveUserSummaryDto,
  })
  user?: LeaveUserSummaryDto;

  @ApiPropertyOptional({
    description: "Reviewer user",
    type: LeaveUserSummaryDto,
  })
  reviewedBy?: LeaveUserSummaryDto | null;

  @ApiProperty({ description: "Created at", example: "2024-02-09T10:00:00Z" })
  createdAt: Date;

  @ApiProperty({ description: "Updated at", example: "2024-02-09T10:00:00Z" })
  updatedAt: Date;
}
