import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, Min, ValidateNested } from "class-validator";
import { LeaveType } from "@prisma/client";

export class LeaveEntitlementDto {
  @ApiProperty({
    description: "Leave type",
    enum: LeaveType,
    example: LeaveType.PAID_LEAVE,
  })
  @IsEnum(LeaveType)
  type: LeaveType;

  @ApiProperty({
    description: "Entitled days for this leave type",
    example: 12,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  entitledDays: number;
}

export class UpdateLeaveEntitlementsDto {
  @ApiProperty({
    description: "Leave entitlements",
    type: [LeaveEntitlementDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LeaveEntitlementDto)
  entitlements: LeaveEntitlementDto[];
}
