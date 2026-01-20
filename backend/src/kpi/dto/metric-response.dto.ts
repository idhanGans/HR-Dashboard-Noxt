import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class MetricResponseDto {
  @ApiProperty({ description: "Metric ID", example: 1 })
  id: number;

  @ApiProperty({ description: "Metric name", example: "Customer Satisfaction" })
  name: string;

  @ApiPropertyOptional({
    description: "Metric description",
    example: "Measures customer satisfaction rating",
  })
  description?: string;

  @ApiProperty({ description: "Whether the metric is active", example: true })
  isActive: boolean;

  @ApiProperty({ description: "Created at", example: "2024-01-01T00:00:00Z" })
  createdAt: Date;

  @ApiProperty({ description: "Updated at", example: "2024-01-01T00:00:00Z" })
  updatedAt: Date;
}
