import { ApiProperty } from "@nestjs/swagger";
import { LeaveType } from "@prisma/client";

export class LeaveBalanceDto {
  @ApiProperty({
    description: "Leave type",
    enum: LeaveType,
    example: LeaveType.PAID_LEAVE,
  })
  type: LeaveType;

  @ApiProperty({
    description: "Total entitlement in days",
    example: 12,
  })
  entitledDays: number;

  @ApiProperty({
    description: "Days already used",
    example: 3,
  })
  usedDays: number;

  @ApiProperty({
    description: "Days remaining",
    example: 9,
  })
  remainingDays: number;

  @ApiProperty({
    description: "Whether the leave type has no annual limit",
    example: false,
  })
  isUnlimited: boolean;
}
