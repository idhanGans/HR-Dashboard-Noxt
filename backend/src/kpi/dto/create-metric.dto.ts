import { IsString, IsOptional, IsNotEmpty } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

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
}
