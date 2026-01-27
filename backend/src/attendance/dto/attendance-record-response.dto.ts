import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AttendanceCheckoutSource, AttendanceStatus } from "@prisma/client";

export class AttendanceUserSummaryDto {
  @ApiProperty({ description: "User ID", example: 1 })
  id: number;

  @ApiProperty({ description: "User full name", example: "John Doe" })
  fullName: string;

  @ApiProperty({ description: "User email", example: "john.doe@example.com" })
  email: string;
}

export class AttendanceRecordResponseDto {
  @ApiProperty({ description: "Attendance record ID", example: 1 })
  id: number;

  @ApiProperty({ description: "User ID", example: 1 })
  userId: number;

  @ApiProperty({
    description: "Check-in timestamp",
    example: "2024-02-01T08:00:00Z",
  })
  checkInAt: Date;

  @ApiPropertyOptional({
    description: "Check-out timestamp",
    example: "2024-02-01T17:00:00Z",
  })
  checkOutAt?: Date | null;

  @ApiProperty({
    description: "Check-out source",
    enum: AttendanceCheckoutSource,
    example: AttendanceCheckoutSource.MANUAL,
  })
  checkOutSource: AttendanceCheckoutSource;

  @ApiProperty({
    description: "Attendance status",
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @ApiPropertyOptional({
    description: "Client IANA timezone (e.g., Asia/Jakarta)",
    example: "Asia/Jakarta",
  })
  timezone?: string | null;

  @ApiPropertyOptional({
    description: "User summary",
    type: AttendanceUserSummaryDto,
  })
  user?: AttendanceUserSummaryDto;

  @ApiProperty({ description: "Created at", example: "2024-02-01T08:00:00Z" })
  createdAt: Date;

  @ApiProperty({ description: "Updated at", example: "2024-02-01T17:00:00Z" })
  updatedAt: Date;
}
