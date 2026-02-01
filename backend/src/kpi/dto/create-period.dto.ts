import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsInt,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreatePeriodDto {
  @ApiProperty({
    description: "Period name",
    example: "January 2024",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Period start date (20th of the month)",
    example: "2024-01-20T00:00:00Z",
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: "Period end date (1st of next month)",
    example: "2024-02-01T23:59:59Z",
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({
    description:
      "Organization ID (optional, only for SUPERADMIN. Defaults to user's organization)",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  organizationId?: number;
}
