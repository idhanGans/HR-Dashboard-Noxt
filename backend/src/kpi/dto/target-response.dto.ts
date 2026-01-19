import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MetricResponseDto } from "./metric-response.dto";
import { PeriodResponseDto } from "./period-response.dto";

export class TargetResponseDto {
  @ApiProperty({ description: "Target ID", example: 1 })
  id: number;

  @ApiProperty({ description: "Metric ID", example: 1 })
  metricId: number;

  @ApiProperty({ description: "Period ID", example: 1 })
  periodId: number;

  @ApiProperty({
    description: "Target score",
    example: 8.5,
  })
  target: number;

  @ApiProperty({ description: "Created at", example: "2024-01-01T00:00:00Z" })
  createdAt: Date;

  @ApiProperty({ description: "Updated at", example: "2024-01-01T00:00:00Z" })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: "Metric details",
    type: MetricResponseDto,
  })
  metric?: MetricResponseDto;

  @ApiPropertyOptional({
    description: "Period details",
    type: PeriodResponseDto,
  })
  period?: PeriodResponseDto;
}
