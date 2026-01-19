import { IsString, IsOptional, IsBoolean } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateMetricDto {
  @ApiPropertyOptional({
    description: "Metric name",
    example: "Customer Satisfaction",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "Metric description",
    example: "Measures customer satisfaction rating",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Whether the metric is active",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
