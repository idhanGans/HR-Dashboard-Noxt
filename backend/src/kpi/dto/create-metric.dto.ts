import { IsString, IsOptional, IsNotEmpty, IsInt } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateMetricDto {
  @ApiProperty({
    description: "Metric name",
    example: "Customer Satisfaction",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: "Metric description",
    example: "Measures customer satisfaction rating",
  })
  @IsOptional()
  @IsString()
  description?: string;

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
